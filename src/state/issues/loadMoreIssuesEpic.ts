import { ofType } from "redux-observable";
import { Observable, from, switchMap, of, catchError } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { PayloadAction } from "@reduxjs/toolkit";
import { loadMoreIssuesFailure, loadMoreIssuesSuccess, loadMoreIssues } from "./issuesSlice";

export const loadMoreIssuesEpic = (action$: Observable<PayloadAction>) =>
  action$.pipe(
    ofType(loadMoreIssues.type),
    switchMap((action) => {
      let queryString = "/api/issues?";
      queryString += `sortBy=${action.payload.sortBy}`;
      queryString += `&sortType=${action.payload.sortType}`;
      queryString += `&offset=${action.payload.offset}`;
      if (action.payload.labelIds) {
        queryString += `&labelIds=[${action.payload.labelIds.join(",")}]`;
      }
      if (action.payload.query) {
        queryString += `&query=${action.payload.query}`;
      }
      if (action.payload.status) {
        queryString += `&status=${action.payload.status}`;
      }
      if (action.payload.type) {
        queryString += `&type=${action.payload.type}`;
      }
      return fromFetch(queryString, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).pipe(
        switchMap((response) => {
          return from(response.json()).pipe(
            switchMap((data) => {
              if (response.ok) {
                return of(
                  loadMoreIssuesSuccess(data)
                );
              } else {
                return of(loadMoreIssuesFailure(data.message));
              }
            }),
            catchError(() => {
              return of(loadMoreIssuesFailure("Error parsing response"));
            })
          );
        }),
        catchError(() => {
          return of(loadMoreIssuesFailure("Network Error"));
        })
      );
    })
  );
