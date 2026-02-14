import React from "react";
import ReactDOM from "react-dom";
import styles from "./NewIssue.module.scss";
import TextInput from "../../components/TextInput/TextInput";
import { useState, useRef } from "react";
import Icon from "../../components/Icon/Icon";
import Tag from "../../components/Tag/Tag";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../state/store";
import { File } from "buffer";
import {
  addFiles,
  IssuesActions,
  submitNewIssue,
  cancelFileUpload,
} from "../../state/issues/issuesSlice";
import BigFile from "../../components/BigFile/BigFile";

interface IssueLabel {
  id: string;
  name: string;
  color: number;
}

interface IssueFileProp {
  file: File;
  state: "pending" | "uploading" | "done";
}

const NewIssue = ({ isOpen, onClose }: { isOpen: boolean; onClose }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [issueType, setIssueType] = useState<"Suggestion" | "Bug">(
    "Suggestion"
  );
  const [selectedLabels, setSelectedLabels] = useState<IssueLabel[]>([]);
  const [issueFiles, setIssueFiles] = useState<{
    [key: string]: IssueFileProp;
  }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const labels = useSelector((state: RootState) => state.labelsSlice.labels);
  const newFiles = useSelector(
    (state: RootState) => state.issuesSlice.newFiles
  );
  const fileIds = Object.values(newFiles).map((file) => file.id);

  const filesUploading = useSelector(
    (state: RootState) => state.issuesSlice.fileLoading
  );

  const dispatch = useDispatch();

  const handleTitleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setTitle(value);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setDescription(value);
  };

  function handleIssueType(type: string) {
    setIssueType(type);
  }

  const handleLabelClick = (label: IssueLabel) => {
    if (selectedLabels.find((obj) => obj.id === label.id)) {
      setSelectedLabels(selectedLabels.filter((obj) => obj.id !== label.id));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const files: File[] = Array.from(e.target.files);
    const names = files.map((file) => file.name);
    dispatch(addFiles(names));
    files.forEach((file) => {
      setIssueFiles((prev) => ({
        ...prev,
        [file.name]: { file: file, state: "pending" },
      }));
      dispatch(IssuesActions.startFileUpload({ file, name: file.name }));
    });
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (fileInputRef.current) {
      fileInputRef.current.files = event.dataTransfer.files;
      const changeEvent = new Event("change", { bubbles: true });
      fileInputRef.current.dispatchEvent(changeEvent);
    }
  };


  const handleSubmitIssue = () => {
    if (filesUploading) return;
    dispatch(
      submitNewIssue({
        type: issueType,
        description: description,
        title: title,
        labelIds:
          selectedLabels.length > 0
            ? selectedLabels.map((obj) => obj.id)
            : undefined,
        fileIds: fileIds,
      })
    );
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles["header"]}>
          <button onClick={onClose} className={styles["close-button"]}>
            <Icon
              light="../../../public/assets/icons/newIssue/close-button.svg"
              dark="../../../public/assets/icons/newIssue/close-button-dark.svg"
              className={styles["close-icon"]}
            />
          </button>
          <Icon
            light="../../../public/assets/icons/newIssue/header.svg"
            dark="../../../public/assets/icons/newIssue/header-dark.svg"
            className={styles["header-icon"]}
          />
        </div>

        <div className={styles["main"]}>
          <TextInput
            value={title}
            onChange={handleTitleChange}
            type="text"
            title={"عنوان"}
            placeholder="عنوان بازخورد را وارد کنید..."
          />
          <TextInput
            size="large"
            value={description}
            onChange={handleDescriptionChange}
            type="text"
            title={"توضیحات"}
            placeholder="توضیحات بازخورد را وارد کنید..."
          />

          <div className={styles["issue-type-container"]}>
            <div className={styles["types-label"]}>
              <Icon
                light="../../../public/assets/icons/filter/type.svg"
                dark="../../../public/assets/icons/filter/type-dark.svg"
                className={styles["type-icon"]}
              />
              دسته‌بندی:
            </div>
            <div className={styles["types"]}>
              <button
                onClick={() => handleIssueType("Suggestion")}
                className={`${styles["type-button"]} ${
                  issueType === "Suggestion" && styles["selected"]
                }`}
              >
                {issueType === "Suggestion" ? (
                  <Icon
                    light="../../../public/assets/icons/newIssue/selected-issue.svg"
                    dark="../../../public/assets/icons/newIssue/selected-issue.svg"
                    className={styles["button-icon"]}
                  />
                ) : (
                  <Icon
                    light="../../../public/assets/icons/newIssue/not-selected-issue.svg"
                    dark="../../../public/assets/icons/newIssue/not-selected-issue-dark.svg"
                    className={styles["button-icon"]}
                  />
                )}
                پیشنهاد
              </button>
              <button
                onClick={() => handleIssueType("Bug")}
                className={`${styles["type-button"]} ${
                  issueType === "Bug" && styles["selected"]
                }`}
              >
                {issueType === "Bug" ? (
                  <Icon
                    light="../../../public/assets/icons/newIssue/selected-issue.svg"
                    dark="../../../public/assets/icons/newIssue/selected-issue.svg"
                    className={styles["button-icon"]}
                  />
                ) : (
                  <Icon
                    light="../../../public/assets/icons/newIssue/not-selected-issue.svg"
                    dark="../../../public/assets/icons/newIssue/not-selected-issue-dark.svg"
                    className={styles["button-icon"]}
                  />
                )}
                گزارش باگ
              </button>
            </div>
          </div>
          <div className={styles["issue-labels"]}>
            <span className={styles["labels-title"]}>برچسب‌ها</span>
            {labels.map((obj) => (
              <Tag
                text={obj.name}
                selected={obj.color === 1}
                className={`${styles["issue-label"]} ${
                  selectedLabels.includes(obj) ? styles["selected"] : ""
                }`}
                key={obj.id}
                onClick={() => handleLabelClick(obj)}
              />
            ))}
          </div>
          <div
            className={styles["file-selection"]}
            onClick={handleDivClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className={styles["file-input"]}
              ref={fileInputRef}
            />
            <Icon
              light="../../../public/assets/icons/newIssue/file-upload.svg"
              dark="../../../public/assets/icons/newIssue/file-upload-dark.svg"
              className={styles["file-upload-icon"]}
            />
            <span className={styles["selection-text-mobile"]}>
              فایل ضمیمه را{" "}
              <span style={{ color: "var(--color-blue-50)" }}>انتخاب</span>{" "}
              کنید.{" "}
            </span>
            <span className={styles["selection-text-desktop"]}>
              برای بارگذاری مستندات، فایل را{" "}
              <span style={{ color: "var(--color-blue-50)" }}>انتخاب</span> کنید
              یا اینجا بکشید
            </span>
          </div>
          <div className={styles["file-view"]}>
            {Object.keys(issueFiles).map((key) => {
              const file = issueFiles[key].file;
              const state = issueFiles[key].state;
              return <BigFile file={file} state={state} key={file.name} />;
            })}
          </div>
        </div>
        <div className={styles["footer"]}>
          <button
            onClick={handleSubmitIssue}
            className={styles["submit-button"]}
          >
            ارسال
          </button>
          <button onClick={onClose} className={styles["back-button"]}>
            بازگشت
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root") as HTMLElement
  );
};

export default NewIssue;
