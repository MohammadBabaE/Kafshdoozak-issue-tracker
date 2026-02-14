import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";

type IssueStatus = "Pending" | "Open" | "InProgress" | "Done";
type FilterStatus = "Pending" | "InProgress" | "Done";
type IssueType = "Bug" | "Suggestion";
type VoteType = "Up" | "Down";

type Label = {
  id: string;
};

type IssueState = {
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

export type FilterProps = {
  sortBy: "Date";
  sortType: "DESC";
  offset: number;
  status: FilterStatus;
};

type BoardIssues = {
  Pending: {
    Issues: IssueState[];
    loading: boolean;
    error?: string;
  };
  InProgress: {
    Issues: IssueState[];
    loading: boolean;
    error?: string;
  };
  Done: {
    Issues: IssueState[];
    loading: boolean;
    error?: string;
  };
};

const initialState: BoardIssues = {
  Pending: {
    Issues: [],
    loading: false,
    error: undefined,
  },
  InProgress: {
    Issues: [],
    loading: false,
    error: undefined,
  },
  Done: {
    Issues: [],
    loading: false,
    error: undefined,
  },
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    getStatusIssues: (state, action: PayloadAction<FilterProps>) => {
      state[action.payload.status].loading = true;
      state[action.payload.status].error = undefined;
    },
    getStatusIssuesSuccess: (
      state,
      action: PayloadAction<{ data: IssueState[]; status: FilterStatus }>
    ) => {
      state[action.payload.status].Issues = action.payload.data.map(
        (issue) => ({
          ...issue,
          upVotes: Math.abs(issue.upVotes) ?? 0,
          downVotes: Math.abs(issue.downVotes) ?? 0,
        })
      );
      state[action.payload.status].loading = false;
      state[action.payload.status].error = undefined;
    },
    getStatusIssuesFailure: (
      state,
      action: PayloadAction<{ error: string; status: FilterStatus }>
    ) => {
      state[action.payload.status].error = action.payload.error;
      state[action.payload.status].loading = false;
    },
    loadMoreBoardIssues: (state, action: PayloadAction<FilterProps>) => {
      state[action.payload.status].loading = true;
      state[action.payload.status].error = undefined;
    },
    loadMoreIssuesSuccess: (
      state,
      action: PayloadAction<{ data: IssueState[]; status: FilterStatus }>
    ) => {
      state[action.payload.status].Issues = state[
        action.payload.status
      ].Issues.concat(
        action.payload.data.map((issue) => ({
          ...issue,
          upVotes: Math.abs(issue.upVotes) ?? 0,
          downVotes: Math.abs(issue.downVotes) ?? 0,
        }))
      );
      state[action.payload.status].loading = false;
      state[action.payload.status].error = undefined;
    },
    loadMoreIssuesFailure: (
      state,
      action: PayloadAction<{ error: string; status: FilterStatus }>
    ) => {
      state[action.payload.status].error = action.payload.error;
      state[action.payload.status].loading = false;
    },
  },
});

export const BoardActions = {
  getBoardIssues: createAction<Partial<FilterProps>>("board/getBoardIssues"),
};

export const {
  getStatusIssues,
  getStatusIssuesSuccess,
  getStatusIssuesFailure,
  loadMoreBoardIssues,
  loadMoreIssuesFailure,
  loadMoreIssuesSuccess,
} = boardSlice.actions;
export default boardSlice.reducer;
