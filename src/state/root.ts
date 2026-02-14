import { combineEpics } from "redux-observable";
import { combineReducers } from "redux";
import { authEpics } from "./auth/authEpics";
import userSlice from "./user/userSlice";
import authSlice from "./auth/authSlice";
import { getUserDataEpic } from "./user/getUserDataEpic";
import issuesSlice from "./issues/issuesSlice";
import { getIssuesEpic } from "./issues/getIssuesEpic";
import { getLabelsEpic } from "./labels/getLabelsEpic";
import labelsSlice from "./labels/labelsSlice";
import { submitIssueVoteEpic } from "./issues/submitIssueVoteEpic";
import { loadMoreIssuesEpic } from "./issues/loadMoreIssuesEpic";
import { submitNewIssueEpic } from "./issues/submitNewIssueEpic";
import boardSlice from "./board/boardSlice";
import { getBoardIssuesEpic } from "./board/getBoardIssuesEpic";
import { getStatusIssuesEpic } from "./board/getStatusIssuesEpic";
import currentIssueSlice from "./currentIssue/currentIssueSlice";
import { getFilesEpic } from "./currentIssue/getFilesEpic";
import { getCurrentIssueEpic } from "./currentIssue/getCurrentIssueEpic";
import { submitVoteEpic } from "./currentIssue/submitVote";
import { getSingleIssueEpic } from "./issues/getSingleIssueEpic";
import uploadFilesEpic from "./issues/uploadFilesEpic";
import uploadProfilePictureEpic from "./user/uploadProfilePictureEpic";
import { updateUserEpic } from "./user/updateUserEpic";
import { getCommentsEpic } from "./currentIssue/getCommentsEpic";
import { loadMoreCommentsEpic } from "./currentIssue/getMoreCommentsEpic";
import { getUsersEpic } from "./currentIssue/getUsersEpic";
import { submitNewCommentEpic } from "./currentIssue/submitNewCommentEpic";
import { editIssueEpic } from "./issues/editIssueEpic";

export const rootEpic = combineEpics(
  authEpics,
  getUserDataEpic,
  getIssuesEpic,
  getSingleIssueEpic,
  getLabelsEpic,
  submitIssueVoteEpic,
  loadMoreIssuesEpic,
  submitNewIssueEpic,
  getBoardIssuesEpic,
  getStatusIssuesEpic,
  getCurrentIssueEpic,
  getFilesEpic,
  submitVoteEpic,
  uploadFilesEpic,
  uploadProfilePictureEpic,
  updateUserEpic,
  getCommentsEpic,
  loadMoreCommentsEpic,
  getUsersEpic,
  submitNewCommentEpic,
  editIssueEpic,
  
);

export const rootReducer = combineReducers({
  userSlice,
  authSlice,
  issuesSlice,
  labelsSlice,
  boardSlice,
  currentIssueSlice,
});
