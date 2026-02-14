import { ofType } from "redux-observable";
import { AuthActions } from "./authSlice";
import { Observable, from, switchMap, of, catchError, tap } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { PayloadAction } from "@reduxjs/toolkit";
import { setUser } from "../user/userSlice";
import { logoutSuccess, logoutFailure } from "./authSlice";

export const logoutEpic = (action$: Observable<PayloadAction>) =>
  action$.pipe(
    ofType(AuthActions.logoutRequest.type),
    switchMap((action) =>
      fromFetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }).pipe(
        switchMap((response) => {
          if (response.ok) {
            return of(
              setUser({
                name: "",
                email: "",
                userId: "",
                role: "Normal",
                avatar: null,
              }),
              logoutSuccess()
            );
          } else {
            return of(logoutFailure("Logout Failed"));
          }
        }),
        catchError(() => {
          return of(logoutFailure("Network Error"));
        })
      )
    )
  );
