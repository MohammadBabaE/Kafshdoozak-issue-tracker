import { PayloadAction } from "@reduxjs/toolkit";
import { ofType } from "redux-observable";
import { Observable, switchMap, from, of, catchError, tap, filter } from "rxjs";
import { setUser, UserActions } from "./userSlice";
import { fromFetch } from "rxjs/fetch";
import { loginFailure, loginSuccess } from "../auth/authSlice";
import {
  CurrentIssueActions,
  setCommentProfiles,
  setCommentsError,
  setCommentsLoading,
} from "./currentIssueSlice";

export const getUsersEpic = (action$: Observable<PayloadAction>) =>
  action$.pipe(
    ofType(CurrentIssueActions.getUsers.type),
    switchMap((action) =>{
        const idsQueryString = action.payload.join(",");
      return fromFetch(`/api/users?ids=[${idsQueryString}]`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).pipe(
        switchMap((response) =>
          from(response.json()).pipe(
            switchMap((data) => {
              if (response.ok) {
                return of(
                  setCommentProfiles(data),
                  setCommentsLoading(false),
                  setCommentsError(undefined)
                );
              } else {
                return of(
                  setCommentsError(data.message),
                  setCommentsLoading(false)
                );
              }
            }),
            catchError(() =>
              of(
                setCommentsError("Error parsing response"),
                setCommentsLoading(false)
              )
            )
          )
        ),
        catchError(() =>
          of(setCommentsError("Network Error "), setCommentsLoading(false))
        )
      )
    }
    )
  );
