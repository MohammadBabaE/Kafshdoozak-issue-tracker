import { ofType } from "redux-observable";
import { from, Observable, of, Subject } from "rxjs";
import {
  concatMap,
  map,
  catchError,
  takeUntil,
  tap,
  filter,
  mergeWith,
} from "rxjs/operators";
import {
  IssuesActions,
  uploadFileProgress,
  uploadFileComplete,
  setCancelFunction,
  cancelFileUpload,
  setFileLoading,
} from "./issuesSlice";
import { PayloadAction } from "@reduxjs/toolkit";

interface CancelReturn<T> {
  promise: Promise<T>;
  cancel: () => void;
}

export function makeCancellableUpload(
  file: File,
  progressSubject: Subject<number>
): CancelReturn<string> {
  const ret: CancelReturn<string> = {
    promise: new Promise(() => {}),
    cancel: () => {},
  };

  const signal = new Promise((resolve, reject) => {
    ret.cancel = () => {
      reject("Cancelled");
    };
  });

  ret.promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/files/upload");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded * 100) / event.total);
        progressSubject.next(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.id);
      } else {
        reject(xhr.statusText);
      }
    };

    xhr.onerror = () => reject(xhr.statusText);

    xhr.onabort = () => reject("Upload cancelled");

    const formData = new FormData();
    formData.append("file", file);
    xhr.send(formData);

    signal.catch((error) => {
      reject(error);
      xhr.abort();
    });
  });

  return ret;
}

const uploadFilesEpic = (action$: Observable<PayloadAction<{ file: File; name: string }>>) =>
  action$.pipe(
    ofType(IssuesActions.startFileUpload.type),
    concatMap((action: PayloadAction<{ file: File; name: string }>) => {
      const progressSubject = new Subject<number>();
      const { promise, cancel } = makeCancellableUpload(
        action.payload.file,
        progressSubject
      );

      const setCancelFunctionAction = setCancelFunction({
        name: action.payload.name,
        cancel,
      });

      const progress$ = progressSubject.pipe(
        map((progress) =>
          uploadFileProgress({ name: action.payload.name, progress })
        ),
        takeUntil(
          action$.pipe(
            ofType(cancelFileUpload.type),
            filter(
              (cancelAction) =>
                cancelAction.payload.name === action.payload.name
            ),
            tap(() => {
              cancel();
              progressSubject.complete();
            })
          )
        ),
        tap({
          complete: () => {
              progressSubject.complete();
          },
        })
      );

      const completion$ = from(promise).pipe(
        map((fileId) => {
          return (
            uploadFileComplete({ name: action.payload.name, fileId })
          );
        }),
        catchError((error) => {
          return of({ type: "UPLOAD_FILE_ERROR", payload: error });
        }),
        tap({
          complete: () => {
            progressSubject.complete();
          },
        })
      );

      return of(setFileLoading(true), setCancelFunctionAction).pipe(
        mergeWith(progress$, completion$)
      );
    }),
  );

export default uploadFilesEpic;
