import { ofType } from "redux-observable";
import { Observable, from, switchMap, of, catchError, mergeMap } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { PayloadAction } from "@reduxjs/toolkit";
import { getStatusIssuesSuccess, getStatusIssuesFailure } from "./boardSlice";
import { FilterProps, getStatusIssues } from "./boardSlice";

export const getStatusIssuesEpic = (action$: Observable<PayloadAction>) =>
  action$.pipe(
    ofType(getStatusIssues.type),
    mergeMap((action: PayloadAction<FilterProps>) => {
      let queryString = "/api/issues?";
      queryString += `sortBy=${action.payload.sortBy}`;
      queryString += `&sortType=${action.payload.sortType}`;
      queryString += `&offset=${action.payload.offset}`;
      queryString += `&status=${action.payload.status}`;

      return fromFetch(queryString, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).pipe(
        switchMap((response) => {
          return from(response.json()).pipe(
            switchMap((data) => {
              if (response.ok) {
                return of(
                  getStatusIssuesSuccess({
                    data: data,
                    status: action.payload.status,
                  })
                );
              } else {
                return of(
                  getStatusIssuesFailure({
                    error: data.message,
                    status: action.payload.status,
                  })
                );
              }
            }),
            catchError(() => {
              return of(
                getStatusIssuesFailure({
                  error: "Error parsing response",
                  status: action.payload.status,
                })
              );
            })
          );
        }),
        catchError(() => {
          return of(
            getStatusIssuesFailure({
              error: "Network Error",
              status: action.payload.status,
            })
          );
        })
      );
    })
  );
