import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  Suspense,
} from "react";
import Icon from "../../components/Icon/Icon";
import Issue from "../../components/Issue/Issue";
import styles from "./Issues.module.scss";
import Tag from "../../components/Tag/Tag";
import { convertToPersianNumbers } from "../../components/Issue/utils/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  handleNewIssueModal,
  handleViewIssueModal,
  getIssues,
  loadMoreIssues,
  IssueState,
  handleLogoutModal,
  handleEditIssueModal,
} from "../../state/issues/issuesSlice";
import {
  CurrentIssueActions,
  setCommentsLoading,
  setCurrentIssue,
  setFilesLoading,
  setIssueLoading,
} from "../../state/currentIssue/currentIssueSlice";
import { RootState } from "../../state/store";
import { getLabels } from "../../state/labels/labelsSlice";
import useIntersector from "../../hooks/useIntersector";
import { ThemeContext } from "../../context/ThemeContext/ThemeContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import {
  setUser,
  startProfilePictureUpload,
  UserActions,
} from "../../state/user/userSlice";
import { loginRequest } from "../../state/auth/authSlice";

const NewIssue = React.lazy(() => import("../NewIssue/NewIsssue"));
const ViewIssue = React.lazy(() => import("../ViewIssue/ViewIssue"));
const Logout = React.lazy(() => import("../Logout/Logout"));
const EditIssue = React.lazy(() => import("../EditIssue/EditIssue"));

type SortOrders = "Date" | "Votes" | "Comments";
type SortIssueTypes = "Suggestion" | "Bug";
type IssueStates = "Pending" | "InProgress" | "Done";

interface IssueLabel {
  id: string;
  name: string;
  color: number;
}

const Issues = () => {
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [sortOrder, setSortOrder] = useState<SortOrders>("Date");

  const [sortIssueType, setSortIssueType] = useState<SortIssueTypes>();
  const [selectedLabels, setSelectedLabels] = useState<IssueLabel[]>([]);
  const [filterStates, setFilterStates] = useState<IssueStates>();
  const [issuesOffset, setIssuesOffset] = useState(0);
  const [profileOptions, setProfileOptions] = useState(false);
  const profileRef = useRef<HTMLInputElement>(null);
  const newIssueOpen = useSelector(
    (state: RootState) => state.issuesSlice.isNewModalOpen
  );
  const viewIssueOpen = useSelector(
    (state: RootState) => state.issuesSlice.isViewModalOpen
  );
  const logoutModalOpen = useSelector(
    (state: RootState) => state.issuesSlice.isLogoutModalOpen
  );
  const editIssueOpen = useSelector(
    (state: RootState) => state.issuesSlice.isEditModalOpen
  );
  const DateFormatter = new Intl.DateTimeFormat("fa-IR", {
    calendar: "persian",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const user = useSelector((state: RootState) => state.userSlice);
  const userId = useSelector((state: RootState) => state.userSlice.userId);
  const avatarId = useSelector(
    (state: RootState) => state.userSlice.avatar?.fileId
  );
  const issues = useSelector((state: RootState) => state.issuesSlice.issues);
  const labels = useSelector((state: RootState) => state.labelsSlice.labels);
  const profileProgress = useSelector(
    (state: RootState) => state.userSlice.profilePictureUpload?.progress
  );
  const state = useSelector(
    (state: RootState) => state.userSlice.profilePictureUpload?.state
  );
  const themeContext = useContext(ThemeContext);
  const { ref: loadMoreRef, isIntersecting } = useIntersector<HTMLDivElement>({
    threshold: 0.5,
  });
  let isSeen = false;
  const topRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const currentIssueLoading = useSelector(
    (state: RootState) => state.currentIssueSlice.issueLoading
  );
  const currentFilesLoading = useSelector(
    (state: RootState) => state.currentIssueSlice.filesLoading
  );
  const currentCommentsLoading = useSelector(
    (state: RootState) => state.currentIssueSlice.commentsLoading
  );

  function scrollToTop() {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleFilterClick() {
    setFilterVisible(!filterVisible);
  }

  function handleSearchBarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchValue(value);
  }

  function handleSortOrder(type: SortOrders) {
    setSortOrder(type);
  }

  function handleSortIssueType(type: SortIssueTypes) {
    if (sortIssueType === type) {
      setSortIssueType(undefined);
      return;
    }
    setSortIssueType(type);
  }

  function handleBoardNavigate() {
    navigate("/board");
  }

  const handleLabelClick = (label: IssueLabel) => {
    if (selectedLabels.find((obj) => obj.id === label.id)) {
      setSelectedLabels(selectedLabels.filter((obj) => obj.id !== label.id));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  const handleFilterState = (state: IssueStates) => {
    if (filterStates === state) {
      setFilterStates(undefined);
    } else {
      setFilterStates(state);
    }
  };

  function handleResetFilter() {
    setSearchValue("");
    setSortOrder("Date");
    setSortIssueType(undefined);
    setSelectedLabels([]);
    setFilterStates(undefined);
  }

  const handleNewIssue = () => {
    if (userId === "" || userId === undefined) {
      navigate("/login");
      return;
    }
    dispatch(handleNewIssueModal(true));
    navigate("/issues/new");
  };
  const handleNewIssueClose = () => {
    dispatch(handleNewIssueModal(false));
    navigate("/issues");
  };

  const handleViewIssue = (issue: IssueState) => {
    dispatch(setIssueLoading(true));
    dispatch(CurrentIssueActions.getCurrentIssue({ id: issue.id }));
    dispatch(setFilesLoading(true));
    dispatch(CurrentIssueActions.getFiles(issue.id));
    dispatch(setCommentsLoading(true));
    dispatch(CurrentIssueActions.getComments(issue.id));
    navigate(`/issues/${issue.id}`);
  };

  const handleViewIssueClose = () => {
    dispatch(handleViewIssueModal(false));
    navigate("/issues");
  };

  const handleEditIssue = (id: string) => {
    dispatch(setIssueLoading(true));
    dispatch(CurrentIssueActions.getCurrentIssue({ id: id }));
    dispatch(setFilesLoading(true));
    dispatch(CurrentIssueActions.getFiles(id));
    dispatch(setCommentsLoading(true));
    dispatch(CurrentIssueActions.getComments(id));
    dispatch(handleViewIssueModal(false));
    dispatch(handleEditIssueModal(true));
    navigate(`/issues/${id}/edit`);
  };

  const handleEditIssueClose = () => {
    dispatch(handleEditIssueModal(false));
    navigate(`/issues`);
  };

  const handleProfileOptions = () => {
    setProfileOptions(!profileOptions);
  };

  const handlepProfileChange = () => {
    if (profileRef.current) {
      profileRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const file: File = e.target.files[0];
    if (file) {
      dispatch(startProfilePictureUpload({ file: file, user: user }));
    }
  };

  const handleLogoutModalClose = () => {
    dispatch(handleLogoutModal(false));
  };

  const handleLogout = () => {
    dispatch(handleLogoutModal(true));
  };

  useEffect(() => {
    isSeen = true;
    setIssuesOffset(0);
    scrollToTop();
    dispatch(
      getIssues({
        sortBy: sortOrder,
        sortType: "DESC",
        labelIds:
          selectedLabels.length > 0
            ? selectedLabels.map((obj) => obj.id)
            : undefined,
        offset: 0,
        query: searchValue === "" ? undefined : searchValue,
        status: filterStates !== undefined ? filterStates : undefined,
        type: sortIssueType !== undefined ? sortIssueType : undefined,
      })
    );
  }, [
    debouncedSearchValue,
    sortOrder,
    sortIssueType,
    selectedLabels,
    filterStates,
  ]);

  useEffect(() => {
    dispatch(getLabels());
  }, []);

  useEffect(() => {
    if (isIntersecting) {
      setIssuesOffset((prevOffset) => prevOffset + 20);
      if (issuesOffset !== 0 && !isSeen) {
        isSeen = true;
        dispatch(
          loadMoreIssues({
            sortBy: sortOrder,
            sortType: "DESC",
            labelIds:
              selectedLabels.length > 0
                ? selectedLabels.map((obj) => obj.id)
                : undefined,
            offset: issuesOffset,
            query: searchValue === "" ? undefined : searchValue,
            status: filterStates !== undefined ? filterStates : undefined,
            type: sortIssueType !== undefined ? sortIssueType : undefined,
          })
        );
      }
    }
  }, [isIntersecting]);

  useEffect(() => {
    if (location.pathname === "/issues/new" && !newIssueOpen) {
      dispatch(handleNewIssueModal(true));
    } else if (params.issueId && !viewIssueOpen && !editIssueOpen) {
      dispatch(setIssueLoading(true));
      dispatch(CurrentIssueActions.getCurrentIssue({ id: params.issueId }));
      dispatch(setFilesLoading(true));
      dispatch(CurrentIssueActions.getFiles(params.issueId));
      dispatch(setCommentsLoading(true));
      dispatch(CurrentIssueActions.getComments(params.issueId));
    } else if (location.pathname !== "/issues/new" && !params.issueId) {
      if (location.pathname === "/") {
        navigate("/issues");
      }
      dispatch(handleNewIssueModal(false));
      dispatch(handleViewIssueModal(false));
      dispatch(handleEditIssueModal(false));
    }
  }, [location.pathname]);

  useEffect(() => {
    if (
      !currentIssueLoading &&
      !currentFilesLoading &&
      !currentCommentsLoading &&
      params.issueId &&
      !viewIssueOpen &&
      !editIssueOpen
    ) {
      if (location.pathname.includes("/edit")) {
        dispatch(handleEditIssueModal(true));
      } else {
        dispatch(handleViewIssueModal(true));
      }
    }
  }, [
    currentIssueLoading,
    currentFilesLoading,
    currentCommentsLoading,
    params.issueId,
  ]);

  return (
    <div className={styles["view-container"]}>
      <div className={styles["header"]}>
        {!filterVisible ? (
          <button
            onClick={handleFilterClick}
            className={styles["filter-button"]}
          >
            <Icon
              light="../../../public/assets/icons/header/filter-icon.svg"
              dark="../../../public/assets/icons/header/filter-icon-dark.svg"
              className={styles["filter-icon"]}
            />
          </button>
        ) : (
          <button onClick={handleFilterClick} className={styles["back-button"]}>
            <Icon
              light="../../../public/assets/icons/header/back-icon.svg"
              dark="../../../public/assets/icons/header/back-icon-dark.svg"
              className={styles["back-icon"]}
            />
          </button>
        )}
        <Icon
          light="../../../public/assets/icons/header/header-logo.svg"
          dark="../../../public/assets/icons/header/header-logo-dark.svg"
          className={styles["header-logo"]}
        />
        {userId === undefined || userId === "" ? (
          <button
            onClick={() => navigate("/login")}
            className={styles["login-profile"]}
          >
            <Icon
              light="../../../public/assets/icons/header/login-icon.svg"
              dark="../../../public/assets/icons/header/login-icon-dark.svg"
              className={styles["login-icon"]}
            />
          </button>
        ) : (
          <div onClick={handleProfileOptions} className={styles["avatar"]}>
            {state === "pending" || state === "uploading" ? (
              <svg className={styles["progress-circle"]} viewBox="0 0 36 36">
                <path
                  className={styles["circle-bg"]}
                  d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={styles["circle"]}
                  strokeDasharray={`${profileProgress}, 100`}
                  d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
            ) : avatarId === (null || undefined) ? (
              <Icon
                light="../../../public/assets/icons/Issue/no-profile.svg"
                dark="../../../public/assets/icons/Issue/no-profile.svg"
                className={styles["profile-pic"]}
              />
            ) : (
              <Icon
                light={`/api/files/${avatarId}`}
                dark={`/api/files/${avatarId}`}
                className={styles["profile-pic"]}
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles["profile-input"]}
              ref={profileRef}
            />
            {profileOptions && (
              <div className={styles["profile-options"]}>
                <button
                  onClick={handlepProfileChange}
                  className={styles["change-profile"]}
                >
                  <Icon
                    light="../../../public/assets/icons/Issue/change-profile.svg"
                    dark="../../../public/assets/icons/Issue/change-profile-dark.svg"
                    className={styles["chagne-profile-icon"]}
                  />
                  تغییر تصویر
                </button>
                <button onClick={handleLogout} className={styles["logout"]}>
                  <Icon
                    light="../../../public/assets/icons/Issue/logout.svg"
                    dark="../../../public/assets/icons/Issue/logout.svg"
                    className={styles["logout-icon"]}
                  />
                  خروج
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div
        data-filter-visible={filterVisible}
        className={styles["issue-filter"]}
      >
        <div className={styles["filter-main"]}>
          <div className={styles["filter-related"]}>
            <div className={styles["filter-label"]}>
              <Icon
                light="../../../public/assets/icons/filter/label.svg"
                dark="../../../public/assets/icons/filter/label-dark.svg"
                className={styles["label-icon"]}
              />
              <span className={styles["label-text"]}>فیلتر</span>
            </div>
            <div className={styles["filter-search"]}>
              <Icon
                light="../../../public/assets/icons/filter/search-bar.svg"
                dark="../../../public/assets/icons/filter/search-bar-dark.svg"
                className={styles["search-icon"]}
              />
              <input
                placeholder="جستجو"
                className={styles["search-input"]}
                type="text"
                value={searchValue}
                onChange={handleSearchBarChange}
              />
            </div>
            <div className={styles["filter-category"]}>
              <div className={styles["order-sort"]}>
                <div className={styles["sort-label"]}>
                  <Icon
                    light="../../../public/assets/icons/filter/sort.svg"
                    dark="../../../public/assets/icons/filter/sort-dark.svg"
                    className={styles["sort-icon"]}
                  />
                  <span className={styles["sort-text"]}>مرتب‌سازی</span>
                </div>
                <div className={styles["sort-types"]}>
                  <span
                    onClick={() => handleSortOrder("Date")}
                    className={`${styles["sort-by"]} ${
                      sortOrder === "Date" && styles["selected"]
                    }`}
                  >
                    جدیدترین
                  </span>
                  <span
                    onClick={() => handleSortOrder("Votes")}
                    className={`${styles["sort-by"]} ${
                      sortOrder === "Votes" && styles["selected"]
                    }`}
                  >
                    بیشترین رای
                  </span>
                  <span
                    onClick={() => handleSortOrder("Comments")}
                    className={`${styles["sort-by"]} ${
                      sortOrder === "Comments" && styles["selected"]
                    }`}
                  >
                    پربحث ترین
                  </span>
                </div>
              </div>
              <div className={styles["type-filter"]}>
                <div className={styles["type-label"]}>
                  <Icon
                    light="../../../public/assets/icons/filter/type.svg"
                    dark="../../../public/assets/icons/filter/type-dark.svg"
                    className={styles["type-icon"]}
                  />
                  <span className={styles["type-text"]}>دسته‌بندی</span>
                </div>
                <div className={styles["issue-types"]}>
                  <span
                    onClick={() => handleSortIssueType("Suggestion")}
                    className={`${styles["type"]} ${
                      sortIssueType === "Suggestion" && styles["selected"]
                    }`}
                  >
                    پیشنهاد
                  </span>
                  <span
                    onClick={() => handleSortIssueType("Bug")}
                    className={`${styles["type"]} ${
                      sortIssueType === "Bug" && styles["selected"]
                    }`}
                  >
                    گزارش باگ
                  </span>
                </div>
              </div>
            </div>
            <div className={styles["filter-issue-labels"]}>
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
          </div>
          <div className={styles["board-related"]}>
            <div className={styles["board-label"]}>
              <Icon
                light="../../../public/assets/icons/filter/board-label.svg"
                dark="../../../public/assets/icons/filter/board-label-dark.svg"
                className={styles["board-label-icon"]}
              />
              <span className={styles["board-label-text"]}>نقشهٔ راه</span>
            </div>
            <div className={styles["filter-issue-states"]}>
              <div className={styles["state-container"]}>
                <span
                  onClick={() => handleFilterState("Pending")}
                  className={`${styles["issue-state"]} ${
                    filterStates === "Pending" && styles["selected"]
                  }`}
                >
                  باز
                </span>
                <span className={styles["state-count"]}>
                  {convertToPersianNumbers(22)}
                </span>
              </div>
              <div className={styles["state-container"]}>
                <span
                  onClick={() => handleFilterState("InProgress")}
                  className={`${styles["issue-state"]} ${
                    filterStates === "InProgress" && styles["selected"]
                  }`}
                >
                  در حال انجام
                </span>
                <span className={styles["state-count"]}>
                  {convertToPersianNumbers(22)}
                </span>
              </div>
              <div className={styles["state-container"]}>
                <span
                  onClick={() => handleFilterState("Done")}
                  className={`${styles["issue-state"]} ${
                    filterStates === "Done" && styles["selected"]
                  }`}
                >
                  انجام شده
                </span>
                <span className={styles["state-count"]}>
                  {convertToPersianNumbers(22)}
                </span>
              </div>
            </div>
            <button
              onClick={handleBoardNavigate}
              className={styles["board-button"]}
            >
              بررسی اجمالی نقشه راه
            </button>
          </div>
        </div>

        <div className={styles["filter-footer"]}>
          <div
            onClick={themeContext?.toggleTheme}
            className={styles["theme-toggle"]}
          >
            <Icon
              light="../../../public/assets/icons/filter/night-mode-off.svg"
              dark="../../../public/assets/icons/filter/night-mode-on.svg"
              className={styles["toggle-button"]}
            />
            <span className={styles["toggle-text"]}>حالت شب</span>
          </div>
          <div onClick={handleResetFilter} className={styles["default-reset"]}>
            <Icon
              light="../../../public/assets/icons/filter/default-icon.svg"
              dark="../../../public/assets/icons/filter/default-icon-dark.svg"
              className={styles["default-button"]}
            />
            <span className={styles["default-text"]}>بازنشانی</span>
          </div>
        </div>
      </div>
      {filterVisible && (
        <button onClick={handleFilterClick} className={styles["set-filters"]}>
          مشاهده
        </button>
      )}
      {!filterVisible && (
        <div className={styles["filter-footer-icon"]}>
          <Icon
            light="../../../public/assets/icons/shared/bale-icon.svg"
            dark="../../../public/assets/icons/shared/bale-icon-dark.svg"
            className={styles["bale-icon"]}
          />
        </div>
      )}
      <div
        className={`${styles["issues-view"]} ${
          (newIssueOpen || viewIssueOpen) && styles["hidden-scroll"]
        }`}
      >
        <div ref={topRef}></div>

        <div
          ref={loadMoreRef}
          data-filter-visible={filterVisible}
          className={styles["issue-list"]}
        >
          {issues.map((issue, index) => {
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
                  index === issues.length - 1 && issues.length % 20 === 0
                    ? loadMoreRef
                    : undefined
                }
                hasTail={true}
                onClick={() => handleViewIssue(issue)}
              />
            );
          })}
        </div>
        <div onClick={handleNewIssue} className={styles["new-issue"]}>
          <Icon
            light="../../../public/assets/icons/Issue/new-issue.svg"
            dark="../../../public/assets/icons/Issue/new-issue.svg"
            className={styles["new-issue-icon"]}
          />
          <span className={styles["new-issue-text"]}>ارسال بازخورد...</span>
        </div>
      </div>
      {newIssueOpen && (
        <Suspense>
          <NewIssue isOpen={newIssueOpen} onClose={handleNewIssueClose} />
        </Suspense>
      )}
      {viewIssueOpen && (
        <Suspense>
          <ViewIssue isOpen={viewIssueOpen} onClose={handleViewIssueClose} onEdit={() => handleEditIssue(params.issueId)}/>
        </Suspense>
      )}
      {logoutModalOpen && (
        <Suspense>
          <Logout isOpen={logoutModalOpen} onClose={handleLogoutModalClose} />
        </Suspense>
      )}
  {editIssueOpen && (
    <Suspense>
      <EditIssue isOpen={editIssueOpen} onClose={handleEditIssueClose} />
    </Suspense>
  )}
    </div>
  );
};

export default Issues;
