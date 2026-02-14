import React, { Ref, useState } from "react";
import Icon from "../Icon/Icon";
import styles from "./Issue.module.scss";
import Tag from "../Tag/Tag";
import useDebounceCallback from "../../hooks/useDebounceCallback";
import { useDispatch } from "react-redux";
import { IssuesActions } from "../../state/issues/issuesSlice";

type IssueProps = {
  type: "Suggestion" | "Bug";
  title: string;
  body: string;
  tags?: string[];
  vote?: "Up" | "Down";
  upVotes: number;
  downVotes: number;
  comments: number;
  date: string;
  state: "Pending" | "Open" | "InProgress" | "Done";
  isOwner?: boolean;
  id: string;
  lastElementRef?: Ref<HTMLDivElement>;
  hasTail?: boolean;
  onClick?:
    & React.MouseEventHandler<HTMLDivElement>
    & React.MouseEventHandler<HTMLHeadingElement>
    & React.MouseEventHandler<HTMLButtonElement>;
};

const Issue = ({
  type,
  title,
  body,
  tags,
  vote,
  upVotes,
  downVotes,
  comments,
  date,
  state,
  isOwner = false,
  id,
  lastElementRef,
  hasTail = false,
  onClick = undefined,
}: IssueProps) => {
  const NumberFormatter = new Intl.NumberFormat("fa");
  const dispatch = useDispatch();

  function handleVote(submit: "Up" | "Down") {
    if (submit === vote) {
      dispatch(
        IssuesActions.submitIssueVote({ request: "DELETE", issueId: id })
      );
    } else if (vote === undefined || vote === null) {
      dispatch(
        IssuesActions.submitIssueVote({
          request: "CREATE",
          issueId: id,
          vote: submit,
        })
      );
    } else {
      dispatch(
        IssuesActions.submitIssueVote({
          request: "UPDATE",
          issueId: id,
          vote: submit,
        })
      );
    }
  }

  return (
    <div
      ref={lastElementRef && lastElementRef}
      className={`${styles["issue-container"]} ${
        isOwner && styles["owner-issue"]
      }`}
      data-has-tail={hasTail}
    >
      <div className={styles["issue-body"]}>
        <Tag
          className={styles["type"]}
          text={type === "Suggestion" ? "پیشنهاد" : "گزارش باگ"}
          selected={true}
        />
        <h2 onClick={onClick} className={styles["title"]}>
          {title}
        </h2>
        <div onClick={onClick} className={styles["issue-text"]}>
          <p>{body}</p>
          <button className={styles["issue-button"]}>
            {!isOwner ? (
              <Icon
                light="../../../public/assets/icons/Issue/issue-arrow.svg"
                dark="../../../public/assets/icons/Issue/issue-arrow-dark.svg"
                className={styles["issue-arrow"]}
              />
            ) : (
              <Icon
                light="../../../public/assets/icons/Issue/issue-arrow.svg"
                dark="../../../public/assets/icons/Issue/issue-arrow.svg"
                className={styles["issue-arrow"]}
              />
            )}
          </button>
        </div>
        <div className={styles["issue-tags"]}>
          {tags &&
            tags.map((tag: string, index: number) => (
              <Tag
                key={index}
                text={tag}
                selected={true}
                className={styles["side-tag"]}
              />
            ))}
        </div>
        <div className={styles["issue-footer"]}>
          <div className={styles["issue-votes"]}>
            <button
              className={`${styles["vote-button"]} ${
                vote === "Up" && styles["selected"]
              }`}
              onClick={() => handleVote("Up")}
            >
              <Icon
                className={styles["issue-like-icon"]}
                light="/assets/icons/Issue/like-button.svg"
                dark="/assets/icons/Issue/like-button.svg"
              />
              <span className={styles["vote-count"]}>
                {NumberFormatter.format(upVotes)}
              </span>
            </button>
            <button
              className={`${styles["vote-button"]} ${
                vote === "Down" && styles["selected"]
              }`}
              onClick={() => handleVote("Down")}
            >
              <Icon
                className={styles["issue-dislike-icon"]}
                light="/assets/icons/Issue/dislike-button.svg"
                dark="/assets/icons/Issue/dislike-button.svg"
              />
              <span className={styles["vote-count"]}>
                {NumberFormatter.format(downVotes)}
              </span>
            </button>
          </div>
          <div className={styles["issue-info"]}>
            <button onClick={onClick} className={styles["issue-comments"]}>
              {!isOwner ? (
                <Icon
                  className={styles["comments-icon"]}
                  light="../../../public/assets/icons/Issue/issue-comments-icon.svg"
                  dark="../../../public/assets/icons/Issue/issue-comments-icon-dark.svg"
                />
              ) : (
                <Icon
                  className={styles["comments-icon"]}
                  light="../../../public/assets/icons/Issue/issue-comments-icon.svg"
                  dark="../../../public/assets/icons/Issue/issue-comments-icon.svg"
                />
              )}
              <span className={styles["comments-count"]}>
                {NumberFormatter.format(comments)}
              </span>
            </button>
            <span className={styles["issue-date"]}>
              {
                date
              }
            </span>
            <Icon
              light={`../../../public/assets/icons/Issue/issue-state-${state}.svg`}
              dark={`../../../public/assets/icons/Issue/issue-state-${state}.svg`}
              className={styles["issue-state"]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Issue;
