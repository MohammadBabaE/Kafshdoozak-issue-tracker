import { ofType } from "redux-observable";
import { Observable, switchMap, of, catchError, EMPTY } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { PayloadAction } from "@reduxjs/toolkit";
import { CurrentIssueActions, setCommentsLoading, setIssueLoading, setNewCommentSuccess } from "./currentIssueSlice";
import { IssuesActions } from "../issues/issuesSlice";

export const submitNewCommentEpic = (
  action$: Observable<PayloadAction<{ issueId: string; text: string }>>
) =>
  action$.pipe(
    ofType(CurrentIssueActions.submitNewComment.type),
    switchMap((action: PayloadAction<{ issueId: string; text: string }>) => {
      return fromFetch(`/api/issues/${action.payload.issueId}/comments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: action.payload.text }),
      }).pipe(
        switchMap((response) => {
          if (response.ok) {
            return of(
              setIssueLoading(true),
              CurrentIssueActions.getCurrentIssue({
                id: action.payload.issueId,
              }),
              setCommentsLoading(true),
              CurrentIssueActions.getComments(action.payload.issueId),
              IssuesActions.getSingleIssue({ id: action.payload.issueId }),
              setNewCommentSuccess(true)
            );
          } else {
            return EMPTY;
          }
        }),
        catchError(() => {
          return EMPTY;
        })
      );
    })
  );
