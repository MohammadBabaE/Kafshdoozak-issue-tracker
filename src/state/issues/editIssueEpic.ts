import { ofType } from "redux-observable";
import { Observable, from, switchMap, of, catchError } from "rxjs";
import { PayloadAction } from "@reduxjs/toolkit";
import { fromFetch } from "rxjs/fetch";
import {
  submitNewIssueFailure,
  EditIssuePayload,
  editIssue,
  editIssueSuccess,
  handleEditIssueModal,
  IssuesActions,
  editIssueFailure,
} from "./issuesSlice";

export const editIssueEpic = (
  action$: Observable<PayloadAction<EditIssuePayload>>
) =>
  action$.pipe(
    ofType(editIssue.type),
    switchMap((action: PayloadAction<EditIssuePayload>) => {
      const reqbody = {
        title: action.payload.title,
        description: action.payload.description,
        status: action.payload.status,
        type: action.payload.type,
        published: true,
      };
      return fromFetch(`/api/issues/${action.payload.issueId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqbody),
      }).pipe(
        switchMap((response) => {
          if (response.ok) {
            return of(
              editIssueSuccess(),
              handleEditIssueModal(false),
              IssuesActions.getSingleIssue({ id: action.payload.issueId })
            );
          } else {
            return of(editIssueFailure(data.message));
          }
        }),
        catchError(() => {
          return of(editIssueFailure("Network Error"));
        })
      );
    })
  );
