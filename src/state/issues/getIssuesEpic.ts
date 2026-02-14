import { ofType } from "redux-observable";
import { Observable, from, switchMap, of, catchError, tap } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { PayloadAction } from "@reduxjs/toolkit";
import { getIssuesFailure, getIssuesSuccess, getIssues } from "./issuesSlice";

export const getIssuesEpic = (action$: Observable<PayloadAction>) =>
  action$.pipe(
    ofType(getIssues.type),
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
                return of(getIssuesSuccess(data));
              } else {
                return of(getIssuesFailure(data.message));
              }
            }),
            catchError(() => {
              return of(getIssuesFailure("Error parsing response"));
            })
          );
        }),
        catchError(() => {
          return of(getIssuesFailure("Network Error"));
        })
      );
    })
  );
