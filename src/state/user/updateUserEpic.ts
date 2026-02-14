import { ofType } from "redux-observable";
import { switchMap, of, catchError, EMPTY, from } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { setUser, UserActions } from "./userSlice";

export const updateUserEpic = (action$) =>
  action$.pipe(
    ofType(UserActions.updateUser.type),
    switchMap((action) => {
      const reqBody = {
        avatarId: action.payload.avatar,
      };
      return fromFetch(`/api/users/${action.payload.userId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      }).pipe(
        switchMap((response) => {
          if (response.ok) {
            localStorage.setItem(
              "user",
              JSON.stringify({
                ...action.payload,
                avatar: { fileId: action.payload.avatar },
              })
            );
            return of(
              setUser({
                ...action.payload,
                avatar: { fileId: action.payload.avatar },
              })
            );
          } else {
            return EMPTY;
          }
        }),
        catchError(() => {
          return EMPTY;
        })
      );
    })
  );
