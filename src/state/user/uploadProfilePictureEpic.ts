import { ofType } from "redux-observable";
import { from, of, Subject } from "rxjs";
import { concatMap, map, catchError, mergeWith, tap } from "rxjs/operators";
import {
  startProfilePictureUpload,
  uploadProfilePictureProgress,
  uploadProfilePictureComplete,
  uploadProfilePictureFailed,
  UserActions,
} from "./userSlice";

function uploadProfilePicture(
  file: File,
  progressSubject: Subject<number>
): Promise<string> {
  return new Promise((resolve, reject) => {
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
        resolve(xhr.response);
      } else {
        reject(xhr.statusText);
      }
    };

    xhr.onerror = () => reject(xhr.statusText);

    const formData = new FormData();
    formData.append("file", file);
    xhr.send(formData);
  });
}

const uploadProfilePictureEpic = (action$) =>
  action$.pipe(
    ofType(startProfilePictureUpload.type),
    concatMap((action) => {
      const progressSubject = new Subject<number>();
      const uploadPromise = uploadProfilePicture(
        action.payload.file,
        progressSubject
      );

      const progress$ = progressSubject.pipe(
        map((progress) => uploadProfilePictureProgress({ progress }))
      );

      const completion$ = from(uploadPromise).pipe(
        tap((response) => {
          const parsedResponse = JSON.parse(response);
        }),
        concatMap((response) => {
            const parsedResponse = JSON.parse(response);
            return of(
              uploadProfilePictureComplete({ fileId: parsedResponse.id }),
              UserActions.updateUser({
                ...action.payload.user,
                avatar: parsedResponse.id,
              })
            );
          }),
        catchError((error) => {
          return of(uploadProfilePictureFailed());
        }),
        tap({
          complete: () => progressSubject.complete(), 
        })
      );

      return of().pipe(mergeWith(progress$, completion$));
    })
  );

export default uploadProfilePictureEpic;
