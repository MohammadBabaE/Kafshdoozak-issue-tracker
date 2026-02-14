import React from "react";
import ReactDOM from "react-dom";
import styles from "./EditIssue.module.scss";
import TextInput from "../../components/TextInput/TextInput";
import { useState, useEffect } from "react";
import Icon from "../../components/Icon/Icon";
import Tag from "../../components/Tag/Tag";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../state/store";
import { File } from "buffer";
import { editIssue, submitNewIssue } from "../../state/issues/issuesSlice";

interface IssueLabel {
  id: string;
  name: string;
  color: number;
}

const EditIssue = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  const [title, setTitle] = useState<string>(
    useSelector(
      (state: RootState) => state.currentIssueSlice.currentIssue.title
    )
  );
  const [description, setDescription] = useState<string>(
    useSelector(
      (state: RootState) => state.currentIssueSlice.currentIssue.description
    )
  );
  const [issueType, setIssueType] = useState<"Suggestion" | "Bug">(
    useSelector((state: RootState) => state.currentIssueSlice.currentIssue.type)
  );
  const issueId = useSelector((state: RootState) => state.currentIssueSlice.currentIssue.id);

  const [status, setStatus] = useState<"Pending" | "InProgress" | "Done">("Pending");

  const stateLabels = useSelector(
    (state: RootState) => state.currentIssueSlice.currentIssue.labels
  );
  const labels = useSelector((state: RootState) => state.labelsSlice.labels);
  const role = useSelector((state: RootState) => state.userSlice.role);
  const [selectedLabels, setSelectedLabels] = useState<IssueLabel[]>([]);

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
  function handleIssueStatus(status: "Pending" | "InProgress" | "Done") {
    setStatus(status);
  }

  useEffect(() => {
    if (stateLabels) {
      const selected = labels.filter((label) =>
        stateLabels.some((stateLabel) => stateLabel.id === label.id)
      );
      setSelectedLabels(selected);
    }
  }, [labels, stateLabels]);

  const handleSubmitIssue = () => {
    dispatch(
      editIssue({
        issueId: issueId,
        type: issueType,
        description: description,
        title: title,
        status: role === "Manager" ? status : undefined,
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
              />
            ))}
          </div>
          {role === "Manager" &&
           <div className={styles["issue-status-container"]}>
            <div className={styles["types-label"]}>
              <Icon
                light="../../../public/assets/icons/filter/type.svg"
                dark="../../../public/assets/icons/filter/type-dark.svg"
                className={styles["type-icon"]}
              />
              وضعیت :
            </div>
            <div className={styles["types"]}>
              <button
                onClick={() => handleIssueStatus("Pending")}
                className={`${styles["type-button"]} ${
                  status === "Pending" && styles["selected"]
                }`}
              >
                {status === "Pending" ? (
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
                باز
              </button>
              <button
                onClick={() => handleIssueStatus("InProgress")}
                className={`${styles["type-button"]} ${
                  status === "InProgress" && styles["selected"]
                }`}
              >
                {status === "InProgress" ? (
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
                در حال انجام
              </button>
              <button
                onClick={() => handleIssueStatus("Done")}
                className={`${styles["type-button"]} ${
                  status === "Done" && styles["selected"]
                }`}
              >
                {status === "Done" ? (
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
                انجام شده
              </button>
            </div>
          </div>}
        </div>
        <div className={styles["footer"]}>
          <button
            onClick={handleSubmitIssue}
            className={styles["submit-button"]}
          >
            ویرایش
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

export default EditIssue;
