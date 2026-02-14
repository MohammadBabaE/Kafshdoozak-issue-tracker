import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";

type IssueStatus = "Pending" | "Open" | "InProgress" | "Done";
type IssueType = "Bug" | "Suggestion";
type VoteType = "Up" | "Down";
type FilterSortBy = "Date" | "Votes" | "Comments";
type FilterSortType = "ASC" | "DESC";
type Label = {
  id: string;
};

export interface IssueFile {
  state: "pending" | "uploading" | "done";
  progress?: number;
  id?: string;
}

export type IssueState = {
  id: string;
  title: string;
  description: string;
  userId: string;
  status: IssueStatus;
  date: number;
  type: IssueType;
  labels?: Label[];
  commentsCount: number;
  published: boolean;
  reviewed?: boolean;
  vote?: VoteType;
  upVotes: number;
  downVotes: number;
};

type FilterProps = {
  sortBy: FilterSortBy;
  sortType: FilterSortType;
  labelIds?: string[];
  offset: number;
  query?: string;
  status?: IssueStatus;
  type?: IssueType;
};

type Issues = {
  issues: IssueState[];
  issueLoading: boolean;
  issueError?: string;
  submitLoading?: boolean;
  submitError?: string;
  editLoading?: boolean;
  editError?: string;
  isNewModalOpen?: boolean;
  isViewModalOpen?: boolean;
  isLogoutModalOpen?: boolean;
  isEditModalOpen?: boolean;
  newFiles: { [key: string]: IssueFile };
  cancelFunctions: { [key: string]: () => void };
  fileLoading?: boolean;
  fileError?: string;
};

export type SubmitIssueVotePayload = {
  request: "CREATE" | "UPDATE" | "DELETE";
  issueId: string;
  vote?: VoteType;
};

export type NewIssuePayload = {
  title: string;
  description: string;
  type: IssueType;
  labelIds?: string[];
  fileIds?: string[];
};

export type EditIssuePayload = {
  issueId: string;
  title: string;
  description: string;
  type: IssueType;
  status?: | "Pending" | "InProgress" | "Done";
}

const initialState: Issues = {
  issues: [],
  issueLoading: false,
  issueError: undefined,
  submitLoading: false,
  submitError: undefined,
  editLoading: false,
  editError: undefined,
  isNewModalOpen: false,
  isViewModalOpen: false,
  isLogoutModalOpen: false,
  isEditModalOpen: false,
  newFiles: {},
  cancelFunctions: {},
  fileLoading: false,
};

const issuesSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    getIssues: (state, action: PayloadAction<FilterProps>) => {
      state.issueError = undefined;
      state.issueLoading = true;
    },
    getIssuesSuccess: (state, action: PayloadAction<IssueState[]>) => {
      state.issues = action.payload.map((issue) => ({
        ...issue,
        upVotes: issue.upVotes ?? 0,
        downVotes: issue.downVotes ?? 0,
      }));
      state.issueLoading = false;
      state.issueError = undefined;
    },
    getIssuesFailure: (state, action: PayloadAction<string>) => {
      state.issueError = action.payload;
      state.issueLoading = false;
    },
    loadMoreIssues: (state, action: PayloadAction<FilterProps>) => {
      state.issueError = undefined;
      state.issueLoading = true;
    },
    loadMoreIssuesSuccess: (state, action: PayloadAction<IssueState[]>) => {
      state.issues = state.issues.concat(
        action.payload.map((issue) => ({
          ...issue,
          upVotes: issue.upVotes ?? 0,
          downVotes: issue.downVotes ?? 0,
        }))
      );
      state.issueLoading = false;
      state.issueError = undefined;
    },
    loadMoreIssuesFailure: (state, action: PayloadAction<string>) => {
      state.issueError = action.payload;
      state.issueLoading = false;
    },
    setSingleIssue: (state, action: PayloadAction<IssueState>) => {
      const issueIndex = state.issues.findIndex(
        (issue) => issue.id === action.payload.id
      );
      if (issueIndex !== -1) {
        state.issues[issueIndex] = {
          ...action.payload,
          commentsCount: action.payload.comments,
        };
      }
    },
    setIssueLoading: (state, action: PayloadAction<boolean>) => {
      state.issueLoading = action.payload;
    },
    setIssueError: (state, action: PayloadAction<string | undefined>) => {
      state.issueError = action.payload;
    },
    handleNewIssueModal: (state, action: PayloadAction<boolean>) => {
      state.isNewModalOpen = action.payload;
    },
    handleViewIssueModal: (state, action: PayloadAction<boolean>) => {
      state.isViewModalOpen = action.payload;
    },
    handleEditIssueModal: (state, action: PayloadAction<boolean>) => {
      state.isEditModalOpen = action.payload;
    },
    handleLogoutModal: (state, action: PayloadAction<boolean>) => {
      state.isLogoutModalOpen = action.payload;
    },
    emptyNewFiles: (state) => {
      state.newFiles = {};
    },
    addFiles: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach((name: string) => {
        if (!state.newFiles[name]) {
          const tempfile: IssueFile = { state: "pending", progress: 0 };
          state.newFiles[name] = tempfile;
        }
      });
    },
    setFileLoading(state, action: PayloadAction<boolean>) {
      state.fileLoading = action.payload;
    },
    uploadFileProgress: (
      state,
      action: PayloadAction<{ name: string; progress: number }>
    ) => {
      const { name, progress } = action.payload;
      if (state.newFiles[name]) {
        state.newFiles[name].progress = progress;
        state.newFiles[name].state = "uploading";
      }
    },
    uploadFileComplete: (state, action: PayloadAction<{ name: string, fileId: string }>) => {
      const { name, fileId } = action.payload;
      if (state.newFiles[name]) {
        state.newFiles[name].state = "done";
        state.newFiles[name].progress = 100;
        state.newFiles[name].id = fileId;
      }
      delete state.cancelFunctions[name];
      const hasPendingOrUploading = Object.values(state.newFiles).some(
        (file) => file.state === "pending" || file.state === "uploading"
      );
      if (!hasPendingOrUploading) {
        state.fileLoading = false;
      }
    },
    cancelFileUpload: (state, action: PayloadAction<{ name: string }>) => {
      const { name } = action.payload;
      if (state.cancelFunctions[name]) {
        state.cancelFunctions[name]();
        delete state.cancelFunctions[name];
      }
      if (state.newFiles[name]) {
        delete state.newFiles[name];
      }
      const hasPendingOrUploading = Object.values(state.newFiles).some(
        (file) => file.state === "pending" || file.state === "uploading"
      );
      if (!hasPendingOrUploading) {
        state.fileLoading = false;
      }
    },
    setCancelFunction: (
      state,
      action: PayloadAction<{ name: string; cancel: () => void }>
    ) => {
      const { name, cancel } = action.payload;
      state.cancelFunctions[name] = cancel;
    },
    submitNewIssue: (state, action: PayloadAction<NewIssuePayload>) => {
      state.submitLoading = true;
      state.submitError = undefined;
    },
    submitNewIssueSuccess: (state) => {
      state.submitLoading = false;
      state.submitError = undefined;
    },
    submitNewIssueFailure: (state, action: PayloadAction<string>) => {
      state.submitError = action.payload;
      state.submitLoading = false;
    },
    editIssue: (state, action: PayloadAction<EditIssuePayload>) => {
      state.editLoading = true;
      state.editError = undefined;
    },
    editIssueSuccess: (state) => {
      state.editLoading = false;
      state.editError = undefined;
    },
    editIssueFailure: (state, action: PayloadAction<string>) => {
      state.editError = action.payload;
      state.editLoading = false;
    },
  },
});

export const IssuesActions = {
  submitIssueVote: createAction<SubmitIssueVotePayload>(
    "issues/submitIssueVote"
  ),
  getSingleIssue: createAction<{ id: string }>("issues/getSingleIssue"),
  startFileUpload: createAction<{ file: File; name: string }>(
    "issues/startFileUpload"
  ),
};

export const {
  getIssues,
  getIssuesSuccess,
  getIssuesFailure,

  loadMoreIssues,
  loadMoreIssuesFailure,
  loadMoreIssuesSuccess,

  handleViewIssueModal,
  handleEditIssueModal,

  handleNewIssueModal,
  emptyNewFiles,
  addFiles,
  uploadFileProgress,
  uploadFileComplete,
  cancelFileUpload,
  setCancelFunction,
  setFileLoading,

  submitNewIssue,
  submitNewIssueSuccess,
  submitNewIssueFailure,
  setSingleIssue,
  setIssueLoading,
  setIssueError,

  editIssue,
  editIssueSuccess,
  editIssueFailure,

  handleLogoutModal,
} = issuesSlice.actions;
export default issuesSlice.reducer;
