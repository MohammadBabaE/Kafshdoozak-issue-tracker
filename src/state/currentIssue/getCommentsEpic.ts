import { ofType } from "redux-observable";
import {
  CurrentIssueActions,
  setCurrentComments,
  setCommentsLoading,
  setCommentsError,
} from "./currentIssueSlice";
import { from, Observable, switchMap, of, catchError, tap } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { PayloadAction } from "@reduxjs/toolkit";

export const getCommentsEpic = (action$: Observable<PayloadAction<string>>) =>
  action$.pipe(
    ofType(CurrentIssueActions.getComments.type),
    switchMap((action: PayloadAction<string>) => {
      return fromFetch(`/api/issues/${action.payload}/comments`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).pipe(
        switchMap((response) => {
          return from(response.json()).pipe(
            switchMap((data) => {
              if (response.ok) {
                const uniqueUserIds = Array.from(
                  new Set(data.map((comment) => comment.userId))
                );
                if (uniqueUserIds.length === 0) {
                  return of(
                    setCurrentComments(data),
                    setCommentsLoading(false),
                    setCommentsError(undefined)
                  );
                } else {
                  return of(
                    setCurrentComments(data),
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
