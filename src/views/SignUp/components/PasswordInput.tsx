import TextInput from "../../../components/TextInput/TextInput";
import React, { useState } from "react";
import { validPasswordLength, validPasswordNumber, validPasswordSpecialChar } from "../utils/utils";

export default function PasswordInput() {
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (!validPasswordLength(value)) {
      setError("رمز عبور باید بین 12 تا 25 کاراکتر باشد.");
      setIsValid(false);
    } else if (!validPasswordSpecialChar(value)) {
      setError("رمز عبور باید حداقل یک کاراکتر خاص داشته باشد.");
      setIsValid(false);
    } else if (!validPasswordNumber(value)) {
      setError("رمز عبور باید حداقل یک عدد داشته باشد.");
      setIsValid(false);
    } else {
      setError("");
      setIsValid(true);
    }
  };
  return (
    <TextInput
      value={password}
      onChange={handlePasswordChange}
      type="password"
      title={"رمز عبور"}
      direction="ltr"
      successText="رمز عبور معتبر است."
      isValid={isValid}
      errorText={error}
      hasError={error !== ""}
      Max={25}
    />
  );
}
