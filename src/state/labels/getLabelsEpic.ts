import { ofType } from "redux-observable";
import { Observable, from, switchMap, of, catchError } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { PayloadAction } from "@reduxjs/toolkit";
import { getLabelsFailure, getLabelsSuccess, getLabels } from "./labelsSlice";

export const getLabelsEpic = (action$: Observable<PayloadAction>) =>
  action$.pipe(
    ofType(getLabels.type),
    switchMap(() => {
      return fromFetch("/api/labels", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).pipe(
        switchMap((response) => {
          return from(response.json()).pipe(
            switchMap((data) => {
              if (response.ok) {
                return of(
                  getLabelsSuccess(data)
                );
              } else {
                return of(getLabelsFailure(data.message));
              }
            }),
            catchError(() => {
              return of(getLabelsFailure("Error parsing response"));
            })
          );
        }),
        catchError(() => {
          return of(getLabelsFailure("Network Error"));
        })
      );
    })
  );
