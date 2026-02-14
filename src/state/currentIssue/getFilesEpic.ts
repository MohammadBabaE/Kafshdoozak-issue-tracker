import { ofType } from "redux-observable";
import {
  CurrentIssueActions,
  setCurrentFiles,
  setFilesError,
  setFilesLoading,
} from "./currentIssueSlice";
import { from, Observable, switchMap, of, catchError, tap } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { PayloadAction } from "@reduxjs/toolkit";

export const getFilesEpic = (action$: Observable<PayloadAction<string>>) =>
  action$.pipe(
    ofType(CurrentIssueActions.getFiles.type),
    switchMap((action: PayloadAction<string>) => {
      return fromFetch(`/api/issues/${action.payload}/files`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).pipe(
        switchMap((response) => {
          return from(response.json()).pipe(
            switchMap((data) => {
              if (response.ok) {
                return of(
                  setCurrentFiles(data),
                  setFilesLoading(false),
                  setFilesError(undefined)
                );
              } else {
                return of(setFilesError(data.message), setFilesLoading(false));
              }
            }),
            catchError(() => {
              return of(
                setFilesError("Error parsing response"),
                setFilesLoading(false)
              );
            })
          );
        }),
        catchError(() => {
          return of(setFilesError("Network Error"), setFilesLoading(false));
        })
      );
    })
  );
