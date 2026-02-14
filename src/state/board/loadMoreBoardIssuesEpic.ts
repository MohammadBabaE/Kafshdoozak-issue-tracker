import { ofType } from "redux-observable";
import { Observable, from, switchMap, of, catchError } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { PayloadAction } from "@reduxjs/toolkit";
import { loadMoreBoardIssues, loadMoreIssuesSuccess, loadMoreIssuesFailure } from "./boardSlice";
import { FilterProps } from "./boardSlice";

export const loadMoreBoardIssuesEpic = (action$: Observable<PayloadAction>) =>
  action$.pipe(
    ofType(loadMoreBoardIssues.type),
    switchMap((action: PayloadAction<FilterProps>) => {
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
                return of(loadMoreIssuesSuccess({data: data, status: action.payload.status}));
              } else {
                return of(loadMoreIssuesFailure({error: data.message, status: action.payload.status}));
              }
            }),
            catchError(() => {
              return of(loadMoreIssuesFailure({error: "Error parsing response", status: action.payload.status}));
            })
          );
        }),
        catchError(() => {
          return of(loadMoreIssuesFailure({error: "Network Error", status: action.payload.status}));
        })
      );
    })
  );
