import TextInput from "../../../components/TextInput/TextInput";
import React, { useState } from "react";
import { validEmail } from "../utils/utils";

export default function EmailInput({email, setEmail, error, }) {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (!validEmail(value)) {
      setError("متن وارد شده فرمت ایمیل نیست.");
      setIsValid(false);
    } else {
      setError("");
      setIsValid(true);
    }
  };
  return (
    <TextInput
      value={email}
      onChange={handleEmailChange}
      type="email"
      title={"ایمیل"}
      size="small"
      direction="ltr"
      errorText={error}
      hasError={error !== ""}
      successText="ایمیل معتبر است."
      isValid={isValid}
    />
  );
}
