import { ofType } from "redux-observable";
import { from, Observable, switchMap, of, catchError } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { PayloadAction } from "@reduxjs/toolkit";
import { IssuesActions, setIssueError, setIssueLoading, setSingleIssue } from "./issuesSlice";

export const getSingleIssueEpic = (
  action$: Observable<PayloadAction<{id: string}>>
) =>
  action$.pipe(
    ofType(IssuesActions.getSingleIssue.type),
    switchMap((action: PayloadAction<{id: string}>) => {
      return fromFetch(`/api/issues/${action.payload.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).pipe(
        switchMap((response) => {
          return from(response.json()).pipe(
            switchMap((data) => {
              if (response.ok) {
                return of(
                  setSingleIssue(data),
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
