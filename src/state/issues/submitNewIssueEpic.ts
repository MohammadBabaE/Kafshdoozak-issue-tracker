import { ofType } from "redux-observable";
import { Observable, from, switchMap, of, catchError } from "rxjs";
import { PayloadAction } from "@reduxjs/toolkit";
import { fromFetch } from "rxjs/fetch";
import {
  submitNewIssue,
  submitNewIssueSuccess,
  submitNewIssueFailure,
  getIssues,
  handleNewIssueModal,
  NewIssuePayload
} from "./issuesSlice";

export const submitNewIssueEpic = (
  action$: Observable<PayloadAction<NewIssuePayload>>
) =>
  action$.pipe(
    ofType(submitNewIssue.type),
    switchMap((action: PayloadAction<NewIssuePayload>) => {
      return fromFetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action.payload),
      }).pipe(
        switchMap((response) => {
          return from(response.json()).pipe(
            switchMap((data) => {
              if (response.ok) {
                return of(
                  submitNewIssueSuccess(),
                  handleNewIssueModal(false),
                  getIssues({ sortBy: "Date", sortType: "DESC", offset: 0 })
                );
              } else {
                return of(submitNewIssueFailure(data.message));
              }
            }),
            catchError(() => {
              return of(submitNewIssueFailure("Error parsing response"));
            })
          );
        }),
        catchError(() => {
          return of(submitNewIssueFailure("Network Error"));
        })
      );
    })
  );
