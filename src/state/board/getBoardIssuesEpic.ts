import { ofType } from "redux-observable";
import { Observable, switchMap, of, catchError, EMPTY } from "rxjs";
import { PayloadAction } from "@reduxjs/toolkit";
import { getStatusIssues } from "./boardSlice";
import { BoardActions, FilterProps } from "./boardSlice";

export const getBoardIssuesEpic = (
  action$: Observable<PayloadAction<FilterProps>>
) =>
  action$.pipe(
    ofType(BoardActions.getBoardIssues.type),
    switchMap((action: PayloadAction<FilterProps>) => {

      const { sortBy, sortType, offset } = action.payload;

      return of(
        getStatusIssues({ sortBy, sortType, offset, status: "Pending" }),
        getStatusIssues({ sortBy, sortType, offset, status: "InProgress" }),
        getStatusIssues({ sortBy, sortType, offset, status: "Done" })
      );
    }),
    catchError((error) => of(EMPTY))
  );
