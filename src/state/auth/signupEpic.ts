import { signupUser } from "../user/userSlice";
import { AuthActions } from "./authSlice";
import { signupSuccess, signupFailure } from "./authSlice";
import { ofType } from "redux-observable";
import { switchMap, catchError } from "rxjs/operators";
import { fromFetch } from "rxjs/fetch";
import { of, from } from "rxjs";
import { PayloadAction } from "@reduxjs/toolkit";

import { Observable } from "rxjs";

export const signupEpic = (action$: Observable<PayloadAction>) =>
  action$.pipe(
    ofType(AuthActions.signupRequest.type),
    switchMap((action) =>
      fromFetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(action.payload),
        headers: { "Content-Type": "application/json" },
      }).pipe(
        switchMap((response) => {
          return from(response.json()).pipe(
            switchMap((data) => {
              if (response.ok) {
                const user = {
                  userId: data.userId,
                  name: data.username,
                  email: data.email,
                  role: "Normal",
                  avatar: undefined,
                  password: action.payload.password,
                };
                localStorage.setItem("user", JSON.stringify(user));
                return of(
                  signupUser({
                    userId: data.userId,
                    name: data.username,
                    email: data.email,
                    password: action.payload.password,
                  }),
                  signupSuccess()
                );
              } else {
                return of(signupFailure(data.message));
              }
            }),
            catchError(() => {
              return of(signupFailure("Error parsing response"));
            })
          );
        }),
        catchError(() => {
          return of(signupFailure("Network error"));
        })
      )
    )
  );
