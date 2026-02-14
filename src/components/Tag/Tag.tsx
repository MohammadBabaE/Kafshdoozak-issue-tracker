import styles from "./Tag.module.scss";
import React from "react";

interface TagProps {
  text: string;
  selected: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Tag({
  text,
  selected = false,
  className,
  onClick,
}: TagProps) {
  return (
    <span
      onClick={onClick}
      className={`brr ${styles["tag"]} ${
        selected && styles["selected"]
      } ${className}`}
    >
      #{text}
    </span>
  );
}
