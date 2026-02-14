import { ofType } from "redux-observable";
import { AuthActions, loginFailure, loginSuccess } from "./authSlice";
import { Observable, from, switchMap, of, catchError, tap } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { PayloadAction } from "@reduxjs/toolkit";
import { UserActions, setUserID } from "../user/userSlice";

export const loginEpic = (action$: Observable<PayloadAction>) =>
  action$.pipe(
    ofType(AuthActions.loginRequest.type),
    switchMap((action) =>
      fromFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action.payload),
      }).pipe(
        switchMap((response) => {
          return from(response.json()).pipe(
            switchMap((data) => {
              if (response.ok) {
                return of(
                  UserActions.getUserData({ userId: data.id, password: action.payload.password }),
                  setUserID({ userId: data.id }),
                  loginSuccess()
                );
              } else {
                return of(loginFailure(data.message));
              }
            }),
            catchError(() => {
              return of(loginFailure("Error parsing response"));
            })
          );
        }),
        catchError(() => {
          return of(loginFailure("Network Error"));
        })
      )
    )
  );
