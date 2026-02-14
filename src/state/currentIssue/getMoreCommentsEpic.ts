import { ofType } from "redux-observable";
import { Observable, from, switchMap, of, catchError } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  CurrentIssueActions,
  setMoreComments,
  setCommentsError,
  setCommentsLoading,
} from "./currentIssueSlice";

export const loadMoreCommentsEpic = (action$: Observable<PayloadAction>) =>
  action$.pipe(
    ofType(CurrentIssueActions.loadMoreComments.type),
    switchMap((action) => {
      let queryString = `/api/issues/${action.payload.issueId}/comments?`;
      queryString += `offset=${action.payload.offset}`;
      return fromFetch(queryString, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).pipe(
        switchMap((response) => {
          return from(response.json()).pipe(
            switchMap((data) => {
              if (response.ok) {
                const uniqueUserIds = Array.from(new Set(data.map((comment) => comment.userId)));
                if (uniqueUserIds.length === 0) {
                  return of(
                    setMoreComments(data),
                    setCommentsLoading(false),
                    setCommentsError(undefined)
                  );
                } else {
                  return of(
                    setMoreComments(data),
                    CurrentIssueActions.getUsers(uniqueUserIds),
                    setCommentsError(undefined)
                  );
                }
              } else {
                return of(
                  setCommentsError(data.message),
                  setCommentsLoading(false)
                );
              }
            }),
            catchError(() => {
              return of(
                setCommentsError("Error parsing response"),
                setCommentsLoading(false)
              );
            })
          );
        }),
        catchError(() => {
          return of(
            setCommentsError("Network Error"),
            setCommentsLoading(false)
          );
        })
      );
    })
  );
