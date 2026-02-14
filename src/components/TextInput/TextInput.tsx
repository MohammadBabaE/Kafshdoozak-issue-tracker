import React from "react";
import styles from "./TextInput.module.scss";
import Icon from "../Icon/Icon";

interface TextInputProps {
  value: string;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  type: string;
  title?: string | undefined;
  size?: "small" | "large";
  placeholder?: string | undefined;
  direction?: "rtl" | "ltr";
  successText?: string | undefined;
  isValid?: boolean;
  errorText?: string | undefined;
  hasError?: boolean;
  guideText?: string | undefined;
}

export default function TextInput({
  value,
  onChange,
  type = "text",
  title = undefined,
  size = "small",
  placeholder = undefined,
  direction = "rtl",
  successText = undefined,
  isValid = false,
  errorText = undefined,
  hasError = false,
}: TextInputProps) {
  return (
    <div
      className={`${styles.container} ${size === "small" ? "" : styles.large}`}
    >
      {title && <span className={styles.title}>{title}</span>}
      {size === "small" ? (
        <input
          spellCheck={false}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder ?? ""}
          dir={direction}
          className={`${styles.input} ${hasError ? styles.error : ""} ${
            isValid ? styles.success : ""
          }`}
        />
      ) : (
        <textarea
          spellCheck={false}
          value={value}
          onChange={onChange}
          placeholder={placeholder ?? ""}
          dir={direction}
          rows={2}
          className={`${styles.input} ${hasError ? styles.error : ""} ${
            isValid ? styles.success : ""
          }`}
          
        />
      )}
      {hasError && (
        <div className={styles.stateContainer}>
          <Icon
            className={styles.errorIcon}
            light="../../../public/assets/icons/TextInput/error-icon.svg"
            dark="../../../public/assets/icons/TextInput/error-icon.svg"
          />{" "}
          <span className={styles.errorText}>{errorText}</span>
        </div>
      )}
      {isValid && (
        <div className={styles.stateContainer}>
          <Icon
            className={styles.successIcon}
            light="../../../public/assets/icons/TextInput/success-icon.svg"
            dark="../../../public/assets/icons/TextInput/success-icon.svg"
          />{" "}
          <span className={styles.successText}>{successText}</span>
        </div>
      )}
    </div>
  );
}
