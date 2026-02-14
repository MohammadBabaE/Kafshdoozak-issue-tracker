import React from "react";
import ReactDOM from "react-dom";
import styles from "./ViewIssue.module.scss";
import { useState, useRef, useEffect } from "react";
import Icon from "../../components/Icon/Icon";
import Tag from "../../components/Tag/Tag";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../state/store";
import { submitNewIssue } from "../../state/issues/issuesSlice";
import SmallFile from "../../components/SmallFile/SmallFile";
import {
  CurrentIssueActions,
  setCommentsLoading,
  setNewCommentSuccess,
} from "../../state/currentIssue/currentIssueSlice";
import useIntersector from "../../hooks/useIntersector";
import Comment from "../../components/Comment/Comment";

interface IssueLabel {
  id: string;
  name: string;
  color: number;
}

const ViewIssue = ({
  isOpen,
  onClose,
  onEdit,
}: {
  isOpen: boolean;
  onClose: React.MouseEventHandler<HTMLButtonElement>;
  onEdit: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  const [commentsOffset, setCommentsOffset] = useState(0);
  const [newComment, setNewComment] = useState("");

  const labels = useSelector((state: RootState) => state.labelsSlice.labels);
  const userId = useSelector((state: RootState) => state.userSlice.userId);
  const role = useSelector((state: RootState) => state.userSlice.role);
  const issue = useSelector(
    (state: RootState) => state.currentIssueSlice.currentIssue
  );
  const comments = useSelector(
    (state: RootState) => state.currentIssueSlice.currentIssue.comments
  );
  const commentsLoading = useSelector(
    (state: RootState) => state.currentIssueSlice.commentsLoading
  );
  let status = issue.status;
  if (issue.status === "Pending" && issue.published) {
    status = "Open";
  }

  const { ref: loadMoreCommentsRef, isIntersecting: isCommentIntersecting } =
    useIntersector<HTMLDivElement>({
      threshold: 0.5,
    });
  const dispatch = useDispatch();
  const NumberFormatter = new Intl.NumberFormat("fa");
  const DateFormatter = new Intl.DateTimeFormat("fa-IR", {
    calendar: "persian",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const topRef = useRef<HTMLDivElement>(null);
  const isSeen = useRef(false);
  const success = useSelector(
    (state: RootState) => state.currentIssueSlice.newCommentSuccess
  );

  function scrollToTop() {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleVote(submit: "Up" | "Down") {
    if (submit === issue.vote) {
      dispatch(
        CurrentIssueActions.submitVote({ request: "DELETE", issueId: issue.id })
      );
    } else if (issue.vote === undefined || issue.vote === null) {
      dispatch(
        CurrentIssueActions.submitVote({
          request: "CREATE",
          issueId: issue.id,
          vote: submit,
        })
      );
    } else {
      dispatch(
        CurrentIssueActions.submitVote({
          request: "UPDATE",
          issueId: issue.id,
          vote: submit,
        })
      );
    }
  }

  const handleNewComment = () => {
    dispatch(
      CurrentIssueActions.submitNewComment({
        text: newComment,
        issueId: issue.id,
      })
    );
  };

  useEffect(() => {
    if (success) {
      setNewComment("");
      dispatch(setNewCommentSuccess(false));
      scrollToTop();
      setCommentsOffset(0);
    }
  }, [success]);

  useEffect(() => {
    if (isCommentIntersecting && !commentsLoading) {
      setCommentsOffset((prevOffset) => prevOffset + 20);
      if (!isSeen.current) {
        isSeen.current = true;
        dispatch(setCommentsLoading(true));
        dispatch(
          CurrentIssueActions.loadMoreComments({
            issueId: issue.id,
            offset: commentsOffset + 20,
          })
        );
      }
    }
  }, [isCommentIntersecting, commentsLoading]);

  useEffect(() => {
    isSeen.current = false;
  }, [comments]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles["header"]}>
          <div className={styles["issue-related"]}>
            {(role === "Manager" ||
              issue.userId.toString() === userId.toString()) && (
                <button className={styles["edit-button"]} onClick={onEdit}>
                  <Icon
                    light="../../../public/assets/icons/IssueView/edit-button.svg"
                    dark="../../../public/assets/icons/IssueView/edit-button-dark.svg"
                    className={styles["edit-icon"]}
                  />
                </button>
            )}
            <Tag
              className={styles["issue-type-tag"]}
              text={issue.type === "Suggestion" ? "پیشنهاد" : "گزارش باگ"}
              selected
            />
            <div className={styles["issue-title"]}>{issue.title}</div>
          </div>
          <button onClick={onClose} className={styles["close-button"]} data-testid="close-button">
            <Icon
              light="../../../public/assets/icons/newIssue/close-button.svg"
              dark="../../../public/assets/icons/newIssue/close-button-dark.svg"
              className={styles["close-icon"]}
            />
          </button>
        </div>

        <div className={styles["main"]}>
          <div className={styles["issue-labels"]}>
            {issue.labels &&
              issue.labels
                .map((label) => label.id)
                .map((id) => labels.find((label) => label.id === id))
                .map((label) => (
                  <Tag
                    text={label?.name}
                    selected
                    className={`${styles["label"]}`}
                    key={label?.id}
                  />
                ))}
          </div>
          <div className={styles["description"]}>{issue.description}</div>
          <div className={styles["files"]}>
            {issue.files &&
              issue.files.map((file) => {
                return <SmallFile file={file} key={file.name} />;
              })}
          </div>

          <div className={styles["issue-footer"]}>
            <div className={styles["issue-votes"]}>
              <button
                className={`${styles["vote-button"]} ${
                  issue.vote === "Up" && styles["selected"]
                }`}
                onClick={() => handleVote("Up")}
              >
                <Icon
                  className={styles["issue-like-icon"]}
                  light="/assets/icons/Issue/like-button.svg"
                  dark="/assets/icons/Issue/like-button.svg"
                />
                <span className={styles["vote-count"]}>
                  {NumberFormatter.format(issue.upVotes)}
                </span>
              </button>
              <button
                className={`${styles["vote-button"]} ${
                  issue.vote === "Down" && styles["selected"]
                }`}
                onClick={() => handleVote("Down")}
              >
                <Icon
                  className={styles["issue-dislike-icon"]}
                  light="/assets/icons/Issue/dislike-button.svg"
                  dark="/assets/icons/Issue/dislike-button.svg"
                />
                <span className={styles["vote-count"]}>
                  {NumberFormatter.format(issue.downVotes)}
                </span>
              </button>
            </div>
            <div className={styles["issue-info"]}>
              <button className={styles["issue-comments"]}>
                <Icon
                  className={styles["comments-icon"]}
                  light="../../../public/assets/icons/Issue/issue-comments-icon.svg"
                  dark="../../../public/assets/icons/Issue/issue-comments-icon-dark.svg"
                />
                <span className={styles["comments-count"]}>
                  {NumberFormatter.format(issue.commentsCount)}
                </span>
              </button>
              <span className={styles["issue-date"]}>
                {DateFormatter.format(new Date(issue.date))}
              </span>
              <Icon
                light={`../../../public/assets/icons/Issue/issue-state-${status}.svg`}
                dark={`../../../public/assets/icons/Issue/issue-state-${status}.svg`}
                className={styles["issue-state"]}
              />
            </div>
          </div>
          <div className={styles["comment-section"]}>
            <div ref={topRef}></div>
            {comments &&
              comments.map((comment, index) => {
                return (
                  <Comment
                    comment={comment}
                    key={comment.id}
                    lastElementRef={
                      index === comments.length - 1 &&
                      comments.length % 20 === 0
                        ? loadMoreCommentsRef
                        : undefined
                    }
                  />
                );
              })}
            {/* <div ref={loadMoreCommentsRef} /> */}
          </div>
        </div>
        <div className={styles["footer"]}>
          <button
            onClick={handleNewComment}
            className={styles["submit-button"]}
          >
            <Icon
              light="../../../public/assets/icons/IssueView/send.svg"
              dark="../../../public/assets/icons/IssueView/send.svg"
              className={styles["send-icon"]}
            />
          </button>
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className={styles["comment-input"]}
            placeholder="نظر خود را بنویسید..."
          />
        </div>
      </div>
    </div>,
    document.getElementById("modal-root") as HTMLElement
  );
};

export default ViewIssue;
