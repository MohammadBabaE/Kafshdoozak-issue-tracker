import { ofType } from "redux-observable";
import { Observable, switchMap, of, catchError, EMPTY } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { PayloadAction } from "@reduxjs/toolkit";
import { CurrentIssueActions } from "./currentIssueSlice";
import { IssuesActions } from "../issues/issuesSlice";

type SubmitIssueVotePayload = {
  request: "CREATE" | "UPDATE" | "DELETE";
  issueId: string;
  vote?: "Up" | "Down";
};

export const submitVoteEpic = (
  action$: Observable<PayloadAction<SubmitIssueVotePayload>>
) =>
  action$.pipe(
    ofType(CurrentIssueActions.submitVote.type),
    switchMap((action: PayloadAction<SubmitIssueVotePayload>) => {

      if (action.payload.request === "CREATE") {
        return fromFetch(`/api/issues/${action.payload.issueId}/votes`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: action.payload.vote }),
        }).pipe(
          switchMap((response) => {
            if (response.ok) {
              return of(
                CurrentIssueActions.getCurrentIssue({
                  id: action.payload.issueId,
                }),
                IssuesActions.getSingleIssue({ id: action.payload.issueId })
              );
            } else {
              return EMPTY;
            }
          }),
          catchError(() => {
            return EMPTY;
          })
        );
      } else if (action.payload.request === "DELETE") {
        return fromFetch(`/api/issues/${action.payload.issueId}/votes`, {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }).pipe(
          switchMap((response) => {
            if (response.ok) {
              return of(
                CurrentIssueActions.getCurrentIssue({
                  id: action.payload.issueId,
                }),
                IssuesActions.getSingleIssue({ id: action.payload.issueId })
              );
            } else {
              return EMPTY;
            }
          }),
          catchError(() => {
            return EMPTY;
          })
        );
      } else {
        return fromFetch(`/api/issues/${action.payload.issueId}/votes`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: action.payload.vote }),
        }).pipe(
          switchMap((response) => {
            if (response.ok) {
              return of(
                CurrentIssueActions.getCurrentIssue({
                  id: action.payload.issueId,
                }),
                IssuesActions.getSingleIssue({ id: action.payload.issueId })
              );
            } else {
              return EMPTY;
            }
          }),
          catchError(() => {
            return EMPTY;
          })
        );
      }
    })
  );
