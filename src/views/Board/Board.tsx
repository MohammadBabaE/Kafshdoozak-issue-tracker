import styles from "./Board.module.scss";
import Icon from "../../components/Icon/Icon";
import { useState, useEffect } from "react";
import { RootState } from "../../state/store";
import { useSelector, useDispatch } from "react-redux";
import { getLabels } from "../../state/labels/labelsSlice";
import Issue from "../../components/Issue/Issue";
import {
  BoardActions,
  loadMoreBoardIssues,
} from "../../state/board/boardSlice";
import useIntersector from "../../hooks/useIntersector";
import { useNavigate } from "react-router-dom";

export default function Board() {
  const [selectedStatus, setSelectedStatus] = useState<
    "Pending" | "InProgress" | "Done"
  >("Pending");
  const [pendingOffset, setPendingOffset] = useState(0);
  const [inProgressOffset, setInProgressOffset] = useState(0);
  const [doneOffset, setDoneOffset] = useState(0);

  const pendingIssues = useSelector(
    (state: RootState) => state.boardSlice.Pending.Issues
  );
  const inProgressIssues = useSelector(
    (state: RootState) => state.boardSlice.InProgress.Issues
  );
  const doneIssues = useSelector(
    (state: RootState) => state.boardSlice.Done.Issues
  );
  const userId = useSelector((state: RootState) => state.userSlice.userId);
  const labels = useSelector((state: RootState) => state.labelsSlice.labels);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ref: loadMorePendingRef, isIntersecting: isPendingIntersecting } =
    useIntersector<HTMLDivElement>({
      threshold: 0.5,
    });
  const {
    ref: loadMoreInProgressRef,
    isIntersecting: isInprogressIntersecting,
  } = useIntersector<HTMLDivElement>({
    threshold: 0.5,
  });
  const { ref: loadMoreDoneRef, isIntersecting: isDoneIntersecting } =
    useIntersector<HTMLDivElement>({
      threshold: 0.5,
    });
  let lastPendingSeen = false;
  let lastInProgressSeen = false;
  let lastDoneSeen = false;

  const DateFormatter = new Intl.DateTimeFormat("fa-IR", {
    calendar: "persian",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const NumberFormatter = new Intl.NumberFormat("fa-IR");

  function handleHomeButton() {
    navigate("/");
  }
  function handleSelectedStatus(status: "Pending" | "InProgress" | "Done") {
    setSelectedStatus(status);
  }

  useEffect(() => {
    lastPendingSeen = true;
    lastInProgressSeen = true;
    lastDoneSeen = true;
    setPendingOffset(0);
    setInProgressOffset(0);
    setDoneOffset(0);

    dispatch(
      BoardActions.getBoardIssues({
        sortBy: "Date",
        sortType: "DESC",
        offset: 0,
      })
    );
  }, []);

  useEffect(() => {
    dispatch(getLabels());
  }, []);

  useEffect(() => {
    if (isPendingIntersecting) {
      setPendingOffset((prevOffset) => prevOffset + 20);
      if (pendingOffset !== 0 && !lastPendingSeen) {
        lastPendingSeen = true;
        dispatch(
          loadMoreBoardIssues({
            sortBy: "Date",
            sortType: "DESC",
            offset: pendingOffset,
            status: "Pending",
          })
        );
      }
    }
  }, [isPendingIntersecting]);

  useEffect(() => {
    if (isInprogressIntersecting) {
      setInProgressOffset((prevOffset) => prevOffset + 20);
      if (inProgressOffset !== 0 && !lastInProgressSeen) {
        lastInProgressSeen = true;
        dispatch(
          loadMoreBoardIssues({
            sortBy: "Date",
            sortType: "DESC",
            offset: pendingOffset,
            status: "InProgress",
          })
        );
      }
    }
  }, [isInprogressIntersecting]);

  useEffect(() => {
    if (isDoneIntersecting) {
      setDoneOffset((prevOffset) => prevOffset + 20);
      if (doneOffset !== 0 && !lastDoneSeen) {
        lastDoneSeen = true;
        dispatch(
          loadMoreBoardIssues({
            sortBy: "Date",
            sortType: "DESC",
            offset: pendingOffset,
            status: "Done",
          })
        );
      }
    }
  }, [isDoneIntersecting]);


  return (
    <div className={styles["container-view"]}>
      <div className={styles["header"]}>
        <div onClick={handleHomeButton}>
          <Icon
            light="../../../public/assets/icons/header/home-button.svg"
            dark="../../../public/assets/icons/header/home-button-dark.svg"
            className={styles["home-button"]}
          />
        </div>
        <Icon
          light="../../../public/assets/icons/header/board-header.svg"
          dark="../../../public/assets/icons/header/board-header-dark.svg"
          className={styles["header-icon"]}
        />
      </div>
      <div className={styles["main"]}>
        <img
          src="../../../public/assets/images/board.png"
          alt=""
          className={styles["board-back-image"]}
        />
        <div className={styles["background"]}>
          <div className={styles["content"]}>
            <div className={styles["content-header"]}>
              <div
                className={`${styles["state-container"]} ${
                  selectedStatus === "Pending" && styles["selected"]
                }`}
              >
                <div>
                  <span
                    onClick={() => handleSelectedStatus("Pending")}
                    className={styles["issue-state"]}
                  >
                    باز
                  </span>
                  <span className={styles["state-count"]}>
                    {NumberFormatter.format(22)}
                  </span>
                </div>
                {selectedStatus === "Pending" && (
                  <div className={styles["selected-underline"]} />
                )}
              </div>
              <div
                className={`${styles["state-container"]} ${
                  selectedStatus === "InProgress" && styles["selected"]
                }`}
              >
                <div>
                  <span
                    onClick={() => handleSelectedStatus("InProgress")}
                    className={styles["issue-state"]}
                  >
                    در حال انجام
                  </span>
                  <span className={styles["state-count"]}>
                    {NumberFormatter.format(22)}
                  </span>
                </div>
                {selectedStatus === "InProgress" && (
                  <div className={styles["selected-underline"]} />
                )}
              </div>
              <div
                className={`${styles["state-container"]} ${
                  selectedStatus === "Done" && styles["selected"]
                }`}
              >
                <div>
                  <span
                    onClick={() => handleSelectedStatus("Done")}
                    className={styles["issue-state"]}
                  >
                    انجام شده
                  </span>
                  <span className={styles["state-count"]}>
                    {NumberFormatter.format(22)}
                  </span>
                </div>
                {selectedStatus === "Done" && (
                  <div className={styles["selected-underline"]} />
                )}
              </div>
              <Icon
                light="../../../public/assets/icons/header/board-header.svg"
                dark="../../../public/assets/icons/header/board-header-dark.svg"
                className={styles["content-header-icon"]}
              />
              <Icon
                light="../../../public/assets/icons/shared/bale-icon.svg"
                dark="../../../public/assets/icons/shared/bale-icon-dark.svg"
                className={styles["bale-icon"]}
              />
            </div>
            <div className={styles["content-navbar"]}>
              <div
                className={`${styles["nav-status"]} ${
                  selectedStatus === "Pending" && styles["selected"]
                } ${styles["pending"]}`}
              >
                <div className={styles["text-related"]}>
                  <div className={styles["line"]}></div>
                  <div className={styles["text"]}>
                    <div className={styles["heading"]}>باز</div>
                    <div className={styles["description"]}>
                      مواردی که هنوز بررسی نشده‌اند.
                    </div>
                  </div>
                </div>
                <span className={styles["status-number"]}>
                  {NumberFormatter.format(22)}
                </span>
              </div>
              <div
                className={`${styles["nav-status"]} ${
                  selectedStatus === "InProgress" && styles["selected"]
                } ${styles["inprogress"]}`}
              >
                <div className={styles["text-related"]}>
                  <div className={styles["line"]}></div>
                  <div className={styles["text"]}>
                    <div className={styles["heading"]}>در حال انجام</div>
                    <div className={styles["description"]}>
                      مواردی که در حال توسعه روی آن‌ها هستیم.
                    </div>
                  </div>
                </div>
                <span className={styles["status-number"]}>
                  {NumberFormatter.format(22)}
                </span>
              </div>
              <div
                className={`${styles["nav-status"]} ${
                  selectedStatus === "Done" && styles["selected"]
                } ${styles["done"]}`}
              >
                <div className={styles["text-related"]}>
                  <div className={styles["line"]}></div>
                  <div className={styles["text"]}>
                    <div className={styles["heading"]}>انجام شده</div>
                    <div className={styles["description"]}>
                      مواردی که توسعۀ آن‌ها به اتمام رسیده است.
                    </div>
                  </div>
                </div>
                <span className={styles["status-number"]}>
                  {NumberFormatter.format(22)}
                </span>
              </div>
            </div>
            <div className={styles["issues-container"]}>
              <div
                ref={loadMorePendingRef}
                className={`${styles["issues-list"]} ${
                  selectedStatus === "Pending" && styles["selected"]
                }`}
              >
                {pendingIssues.map((issue, index) => {
                  const issueDate = DateFormatter.format(new Date(issue.date));
                  let status = issue.status;
                  if (issue.status === "Pending" && issue.published) {
                    status = "Open";
                  }
                  let userVote = issue.vote;
                  if (userVote && userVote !== "Down" && userVote !== "Up") {
                    userVote = userVote.type;
                  }

                  return (
                    <Issue
                      key={issue.id}
                      type={issue.type}
                      title={issue.title}
                      body={issue.description}
                      tags={
                        issue.labels &&
                        issue.labels
                          .map((label) => label.id)
                          .map((id) => labels.find((label) => label.id === id))
                          .map((label) => label?.name)
                      }
                      vote={userVote}
                      upVotes={issue.upVotes}
                      downVotes={issue.downVotes}
                      comments={issue.commentsCount}
                      date={issueDate}
                      state={status}
                      isOwner={userId.toString() === issue.userId.toString()}
                      id={issue.id}
                      lastElementRef={
                        index === pendingIssues.length - 1 &&
                        pendingIssues.length % 20 === 0
                          ? loadMorePendingRef
                          : undefined
                      }
                    />
                  );
                })}
              </div>
              <div
                ref={loadMoreInProgressRef}
                className={`${styles["issues-list"]} ${
                  selectedStatus === "InProgress" && styles["selected"]
                }`}
              >
                {inProgressIssues.map((issue, index) => {
                  const issueDate = DateFormatter.format(new Date(issue.date));
                  let status = issue.status;
                  if (issue.status === "Pending" && issue.published) {
                    status = "Open";
                  }
                  let userVote = issue.vote;
                  if (userVote && userVote !== "Down" && userVote !== "Up") {
                    userVote = userVote.type;
                  }

                  return (
                    <Issue
                      key={issue.id}
                      type={issue.type}
                      title={issue.title}
                      body={issue.description}
                      tags={
                        issue.labels &&
                        issue.labels
                          .map((label) => label.id)
                          .map((id) => labels.find((label) => label.id === id))
                          .map((label) => label?.name)
                      }
                      vote={userVote}
                      upVotes={issue.upVotes}
                      downVotes={issue.downVotes}
                      comments={issue.commentsCount}
                      date={issueDate}
                      state={status}
                      isOwner={userId.toString() === issue.userId.toString()}
                      id={issue.id}
                      lastElementRef={
                        index === inProgressIssues.length - 1 &&
                        inProgressIssues.length % 20 === 0
                          ? loadMoreInProgressRef
                          : undefined
                      }
                    />
                  );
                })}
              </div>
              <div
                ref={loadMoreDoneRef}
                className={`${styles["issues-list"]} ${
                  selectedStatus === "Done" && styles["selected"]
                }`}
              >
                {doneIssues.map((issue, index) => {
                  const issueDate = DateFormatter.format(new Date(issue.date));
                  let status = issue.status;
                  if (issue.status === "Pending" && issue.published) {
                    status = "Open";
                  }
                  let userVote = issue.vote;
                  if (userVote && userVote !== "Down" && userVote !== "Up") {
                    userVote = userVote.type;
                  }

                  return (
                    <Issue
                      key={issue.id}
                      type={issue.type}
                      title={issue.title}
                      body={issue.description}
                      tags={
                        issue.labels &&
                        issue.labels
                          .map((label) => label.id)
                          .map((id) => labels.find((label) => label.id === id))
                          .map((label) => label?.name)
                      }
                      vote={userVote}
                      upVotes={issue.upVotes}
                      downVotes={issue.downVotes}
                      comments={issue.commentsCount}
                      date={issueDate}
                      state={status}
                      isOwner={userId.toString() === issue.userId.toString()}
                      id={issue.id}
                      lastElementRef={
                        index === doneIssues.length - 1 &&
                        doneIssues.length % 20 === 0
                          ? loadMoreDoneRef
                          : undefined
                      }
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
