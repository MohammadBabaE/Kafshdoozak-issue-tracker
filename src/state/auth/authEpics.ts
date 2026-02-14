import { combineEpics } from "redux-observable";
import { signupEpic } from "./signupEpic";
import { loginEpic } from "./loginEpic";
import { logoutEpic } from "./logoutEpic";

export const authEpics = combineEpics(signupEpic, loginEpic, logoutEpic);
