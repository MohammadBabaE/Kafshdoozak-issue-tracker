import { useState, useEffect, useRef } from "react";
import styles from "./BigFile.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../state/store";
import { cancelFileUpload } from "../../state/issues/issuesSlice";

type FileProp = {
  file: File;
  state: string;
};

function BigFile({ file }: FileProp) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileExtension = file.name.split(".").pop();
  const progress = useSelector(
    (state: RootState) => state.issuesSlice.newFiles[file.name]?.progress
  );
  const state = useSelector(
    (state: RootState) => state.issuesSlice.newFiles[file.name]?.state
  );
  const dispatch = useDispatch();
  const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
  let progressMB;
  if(progress){
     progressMB = ((file.size * (progress / 100)) / (1024 * 1024)).toFixed(2);

  }
  else{
    const fakeprogress = 0;
     progressMB = fakeprogress.toFixed(2);
  }

  function handleUploadCancel() {
    dispatch(cancelFileUpload({ name: file.name }));
  }

  useEffect(() => {
    if (file.type.startsWith("image")) {
      const objectUrl = URL.createObjectURL(file);
      setImageSrc(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else if (file.type.startsWith("video")) {
      const objectUrl = URL.createObjectURL(file);
      const videoElement = videoRef.current;
      const canvasElement = canvasRef.current;

      if (videoElement && canvasElement) {
        videoElement.src = objectUrl;
        videoElement.onloadeddata = () => {
          videoElement.currentTime = 2; 
        };

        videoElement.onseeked = () => {
          const context = canvasElement.getContext("2d");
          if (context) {
            const aspectRatio =
              videoElement.videoWidth / videoElement.videoHeight;
            const canvasWidth = 300;
            const canvasHeight = canvasWidth / aspectRatio; 

            canvasElement.width = canvasWidth;
            canvasElement.height = canvasHeight;

            context.drawImage(videoElement, 0, 0, canvasWidth, canvasHeight);
            const thumbnailUrl = canvasElement.toDataURL();
            setImageSrc(thumbnailUrl);
            URL.revokeObjectURL(objectUrl); 
          }
        };
      }
    }
  }, [file]);

  return (
    <div className={styles["file-bg"]}>
      <div className={styles["file-related"]}>
        {file.type.startsWith("image") ? (
          <img
            className={styles["image"]}
            src={imageSrc || ""}
            alt="Uploaded filesssssss"
          />
        ) : file.type.startsWith("video") ? (
          <>
            <video ref={videoRef} style={{ display: "none" }} />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            {imageSrc && (
              <img
                className={styles["image"]}
                src={imageSrc}
                alt="Video thumbnail"
              />
            )}
          </>
        ) : (
          <div data-type={"non-image"} className={styles["non-image"]}>
            {fileExtension}
          </div>
        )}
        {(state === "uploading" || state === "pending") && (
          <div onClick={handleUploadCancel} className={styles["uploading"]}>
            <svg className={styles["progress-circle"]} viewBox="0 0 36 36">
              <path
                className={styles["circle-bg"]}
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={styles["circle"]}
                strokeDasharray={`${progress}, 100`}
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <line
                x1="15"
                y1="15"
                x2="21"
                y2="21"
                className={styles["cross"]}
              />
              <line
                x1="21"
                y1="15"
                x2="15"
                y2="21"
                className={styles["cross"]}
              />
            </svg>
          </div>
        )}
        <div className={styles["file-text"]}>
          <div className={styles["file-name"]}>{file.name}</div>
          <div className={styles["file-progress"]}>{`${progressMB}/${fileSizeMB}`}</div>
        </div>
      </div>
    </div>
  );
}

export default BigFile;
