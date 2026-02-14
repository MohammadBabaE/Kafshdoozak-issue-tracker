import { ofType } from "redux-observable";
import {
  CurrentIssueActions,
  setCurrentIssue,
  setIssueError,
  setIssueLoading,
} from "./currentIssueSlice";
import { from, Observable, switchMap, of, catchError } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { PayloadAction } from "@reduxjs/toolkit";

export const getCurrentIssueEpic = (
  action$: Observable<PayloadAction<{ id: string }>>
) =>
  action$.pipe(
    ofType(CurrentIssueActions.getCurrentIssue.type),
    switchMap((action: PayloadAction<{ id: string }>) => {
      return fromFetch(`/api/issues/${action.payload.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).pipe(
        switchMap((response) => {
          return from(response.json()).pipe(
            switchMap((data) => {
              if (response.ok) {
                data.commentsCount = data.comments;
                delete data.comments;
                return of(
                  setCurrentIssue(data),
                  setIssueLoading(false),
                  setIssueError(undefined)
                );
              } else {
                return of(setIssueError(data.message), setIssueLoading(false));
              }
            }),
            catchError(() => {
              return of(
                setIssueError("Error parsing response"),
                setIssueLoading(false)
              );
            })
          );
        }),
        catchError(() => {
          return of(setIssueError("Network Error"), setIssueLoading(false));
        })
      );
    })
  );
