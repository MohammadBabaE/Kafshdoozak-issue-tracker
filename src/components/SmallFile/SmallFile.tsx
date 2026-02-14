import { FileType } from "../../state/currentIssue/currentIssueSlice";
import Icon from "../Icon/Icon";
import styles from "./SmallFile.module.scss";
import { useState, useEffect, useRef } from "react";

type FileProp = {
  file: FileType;
};

function SmallFile({ file }: FileProp) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileNameParts = file.name.split(".");
  const fileExtension = fileNameParts.pop();
  const name = fileNameParts.join(".");

  useEffect(() => {
    if (file.mimeType.startsWith("image")) {
      setImageSrc(file.path.replace("http://localhost:3000", "/api"));
    } else if (file.mimeType.startsWith("video")) {
      const videoElement = videoRef.current;
      const canvasElement = canvasRef.current;

      if (videoElement && canvasElement) {
        videoElement.src = file.path.replace("http://localhost:3000", "/api");
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
          }
        };
      }
    }
  }, [file]);


  const handleVideoClick = () => {
    if (videoRef.current) {
      videoRef.current.style.display = "block";
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.mozRequestFullScreen) { 
        videoRef.current.mozRequestFullScreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) { 
        videoRef.current.msRequestFullscreen();
      }
      videoRef.current.play();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
          videoRef.current.style.display = "none";
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("msfullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <>
      <div className={styles["file-bg"]}>
        {file.mimeType.startsWith("image") ? (
          <img
            className={styles["image"]}
            src={imageSrc || ""}
            alt="Uploaded filesssssss"
            ref={imageRef}
          />
        ) : file.mimeType.startsWith("video") ? (
          <>
            <video ref={videoRef} style={{ display: "none" }} />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            {imageSrc && (
              <div onClick={handleVideoClick} className={styles["video-container"]}>
                <img
                  className={styles["image"]}
                  src={imageSrc}
                  alt="Video thumbnail"
                />
                <Icon
                  light="../../../public/assets/icons/IssueView/play-button.svg"
                  dark="../../../public/assets/icons/IssueView/play-button.svg"
                  className={styles["play-button"]}
                />
              </div>
            )}
          </>
        ) : (
          <div data-type={"non-image"} className={styles["non-image"]}>
            <div className={styles["file-name"]}>{name}</div>
            <div className={styles["file-extension"]}>{fileExtension}</div>
          </div>
        )}
      </div>
    </>
  );
}

export default SmallFile;
