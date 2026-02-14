import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import Icon from "../Icon/Icon";
import styles from "./Comment.module.scss";
import { Ref } from "react";

type CommentType = {
  id: string;
  userId: string;
  text: string;
  date: number;
  published: boolean;
  avatar?: string;
  name?: string;
};

const Comment = ({
  comment,
  lastElementRef,
}: {
  comment: CommentType;
  lastElementRef?: Ref<HTMLDivElement>;
}) => {
  const userId = useSelector((state: RootState) => state.userSlice.userId);
  const DateFormatter = new Intl.DateTimeFormat("fa-IR", {
    calendar: "persian",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const date = DateFormatter.format(new Date(comment.date));

  return (
    <>
      {comment.userId.toString() === userId.toString() ? (
        <div
          ref={lastElementRef && lastElementRef}
          className={styles["own-comment-container"]}
        >
          {comment.avatar ? (
            <img
              src={`/api/files/${comment.avatar}`}
              className={styles["profile"]}
            />
          ) : (
            <Icon
              light="../../../public/assets/icons/Issue/no-profile.svg"
              dark="../../../public/assets/icons/Issue/no-profile.svg"
              className={styles["profile"]}
            />
          )}
          <Icon
            light="../../../public/assets/icons/IssueView/own-commnet-tail.svg"
            dark="../../../public/assets/icons/IssueView/own-commnet-tail.svg"
            className={styles["comment-tail"]}
          />
          <div className={styles["comment-box"]}>
            <div className={styles["writer"]}>{comment.name}</div>
            <div className={styles["text"]}>{comment.text}</div>
            <div className={styles["date"]}>{date}</div>
          </div>
        </div>
      ) : (
        <div
          ref={lastElementRef && lastElementRef}
          className={styles["comment-container"]}
        >
          {comment.avatar ? (
            <img
              src={`/api/files/${comment.avatar}`}
              className={styles["profile"]}
            />
          ) : (
            <Icon
              light="../../../public/assets/icons/Issue/no-profile.svg"
              dark="../../../public/assets/icons/Issue/no-profile.svg"
              className={styles["profile"]}
            />
          )}
          <Icon
            light="../../../public/assets/icons/IssueView/others-comment.svg"
            dark="../../../public/assets/icons/IssueView/others-comment-dark.svg"
            className={styles["comment-tail"]}
          />
          <div className={styles["comment-box"]}>
            <div className={styles["writer"]}>{comment.name}</div>
            <div className={styles["text"]}>{comment.text}</div>
            <div className={styles["date"]}>{date}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Comment;
