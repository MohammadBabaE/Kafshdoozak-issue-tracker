import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IssueState, SubmitIssueVotePayload } from "../issues/issuesSlice";

type IssueStatus = "Pending" | "Open" | "InProgress" | "Done";
type IssueType = "Bug" | "Suggestion";
type VoteType = "Up" | "Down";
type Label = {
  id: string;
};
export type FileType = {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  path: string;
  state: "Done" | "Uploading" | "Failed" | "Pending";
};

type Comment = {
  id: string;
  userId: string;
  text: string;
  date: number;
  published: boolean;
  avatar?: string;
  name?: string;
};

type CurrentIssue = {
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
  files?: FileType[];
  comments?: Comment[];
};

type CurrentIssueState = {
  currentIssue: CurrentIssue;
  issueLoading: boolean;
  issueError?: string;
  filesLoading: boolean;
  filesError?: string;
  commentsLoading: boolean;
  commentsError?: string;
  newCommentSuccess?: boolean;
};

const initialState: CurrentIssueState = {
  currentIssue: {
    id: "",
    title: "",
    description: "",
    userId: "",
    status: "Pending",
    date: 0,
    type: "Bug",
    commentsCount: 0,
    published: false,
    upVotes: 0,
    downVotes: 0,
    files: [],
    comments: [],
  },
  issueLoading: false,
  filesLoading: false,
  commentsLoading: false,
};

const currentIssueSlice = createSlice({
  name: "currentIssue",
  initialState,
  reducers: {
    setCurrentIssue: (state, action: PayloadAction<IssueState>) => {
      let userVote = action.payload.vote;
      if (userVote && userVote !== "Down" && userVote !== "Up") {
        userVote = userVote.type;
      }
      state.currentIssue = {
        ...state.currentIssue,
        ...action.payload,
        vote: userVote,
      };
    },
    setIssueLoading: (state, action: PayloadAction<boolean>) => {
      state.issueLoading = action.payload;
    },
    setIssueError: (state, action: PayloadAction<string | undefined>) => {
      state.issueError = action.payload;
    },
    setCurrentFiles: (state, action: PayloadAction<FileType[]>) => {
      state.currentIssue.files = action.payload;
    },
    setFilesLoading: (state, action: PayloadAction<boolean>) => {
      state.filesLoading = action.payload;
    },
    setFilesError: (state, action: PayloadAction<string | undefined>) => {
      state.filesError = action.payload;
    },
    setCurrentComments: (state, action: PayloadAction<Comment[]>) => {
      state.currentIssue.comments = action.payload;
    },
    setMoreComments: (state, action: PayloadAction<Comment[]>) => {
      if (!state.currentIssue.comments) {
        state.currentIssue.comments = action.payload;
      } else {
        state.currentIssue.comments = state.currentIssue.comments.concat(
          action.payload
        );
      }
    },
    setCommentProfiles: (state, action: PayloadAction) => {
      state.currentIssue.comments?.forEach((comment) => {
        const user = action.payload.find(
          (user) => user.id.toString() === comment.userId.toString()
        );
        if (user) {
          comment.name = user.name;
          if (user.avatarId) {
            comment.avatar = user.avatarId;
          }
        }
      });
    },
    setCommentsLoading: (state, action: PayloadAction<boolean>) => {
      state.commentsLoading = action.payload;
    },
    setCommentsError: (state, action: PayloadAction<string | undefined>) => {
      state.commentsError = action.payload;
    },
    setNewCommentSuccess: (state, action: PayloadAction<boolean>) => {
      state.newCommentSuccess = action.payload;
    },
  },
});

export const CurrentIssueActions = {
  getCurrentIssue: createAction<{ id: string }>("currentIssue/getCurrentIssue"),
  getFiles: createAction<string>("currentIssue/getFiles"),
  getUsers: createAction<string[]>("currentIssue/getUsers"),
  getComments: createAction<string>("currentIssue/getComments"),
  loadMoreComments: createAction<{ issueId: string; offset: number }>(
    "currentIssue/loadMoreComments"
  ),
  submitVote: createAction<SubmitIssueVotePayload>(
    "currentIssue/submitIssueVote"
  ),
  submitNewComment: createAction<{issueId: string, text: string}>("currentIssue/submitNewComment"),
};

export const {
  setCurrentIssue,
  setIssueLoading,
  setIssueError,
  setCurrentFiles,
  setFilesLoading,
  setFilesError,
  setCurrentComments,
  setMoreComments,
  setCommentProfiles,
  setCommentsLoading,
  setCommentsError,
  setNewCommentSuccess
} = currentIssueSlice.actions;
export default currentIssueSlice.reducer;
