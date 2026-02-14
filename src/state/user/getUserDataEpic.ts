import { PayloadAction } from "@reduxjs/toolkit";
import { ofType } from "redux-observable";
import { Observable, switchMap, from, of, catchError, tap } from "rxjs";
import { setUser, UserActions } from "./userSlice";
import { fromFetch } from "rxjs/fetch";
import { loginFailure, loginSuccess } from "../auth/authSlice";

export const getUserDataEpic = (action$: Observable<PayloadAction>) =>
  action$.pipe(
    ofType(UserActions.getUserData.type),
    switchMap((action) =>
      fromFetch(`/api/users?ids=[${action.payload.userId}]`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).pipe(
        switchMap((response) =>
          from(response.json()).pipe(
            switchMap((data) => {
              if (response.ok) {
                const user = {
                  name: data[0].name,
                  email: data[0].email,
                  role: data[0].role,
                  avatar: data[0].avatar,
                  userId: data[0].id,
                  password: action.payload.password,
                };
                localStorage.setItem("user", JSON.stringify(user));
                return of(
                  setUser(user),
                  loginSuccess()
                );
              } else {
                return of(loginFailure(data.message));
              }
            }),
            catchError(() => of(loginFailure("Error parsing response")))
          )
        ),
        catchError(() => of(loginFailure("Network Error ")))
      )
    )
  );
