import { useEffect, useState } from "react";
import TextInput from "../../components/TextInput/TextInput";
import {
  validEmail,
  validPasswordLength,
  validPasswordSpecialChar,
  validPasswordNumber,
  validUsernameCharacters,
} from "./utils/utils";
import HomeButton from "../../components/HomeButton/HomeButton";
import styles from "./SignUp.module.scss";
import Icon from "../../components/Icon/Icon";
import { useDispatch, useSelector } from "react-redux";
import { AuthActions } from "../../state/auth/authSlice";
import { RootState } from "../../state/store";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [emailIsValid, setEmailIsValid] = useState<boolean>(false);

  const [username, setUsername] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [usernameIsValid, setUsernameIsValid] = useState<boolean>(false);

  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordIsValid, setPasswordIsValid] = useState<boolean>(false);

  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [passwordConfirmationError, setPasswordConfirmationError] =
    useState<string>("");
  const [passwordConfirmationIsValid, setPasswordConfirmationIsValid] =
    useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state: RootState) => state.authSlice.error);
  const doesExist = error === "User is already exists.";

  const loading = useSelector((state: RootState) => state.authSlice.isLoading);

  const handleEmailChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setEmail(value);

    if (!validEmail(value)) {
      setEmailError("ایمیل وارد شده معتبر نیست.");
      setEmailIsValid(false);
    } else {
      setEmailError("");
      setEmailIsValid(true);
    }
  };
  const handleUsernameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    if (value.length > 20) {
      setUsernameError("نام کاربری نمی‌تواند بیشتر از ۲۰ کاراکتر باشد.");
      setUsernameIsValid(false);
      return;
    }
    setUsername(value);

    if (value.length < 3) {
      setUsernameError("نام کاربری باید حداقل ۳ کاراکتر باشد.");
      setUsernameIsValid(false);
    } else if (!validUsernameCharacters(value)) {
      setUsernameError(
        "نام کاربری فقط می‌تواند شامل حروف فارسی، انگلیسی، اعداد و فاصله باشد."
      );
      setUsernameIsValid(false);
    } else {
      setUsernameError("");
      setUsernameIsValid(true);
    }
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    if (value.length > 25) {
      setPasswordError("رمز عبور نمی‌تواند بیشتر از ۲۵ کاراکتر باشد.");
      setPasswordIsValid(false);
      return;
    }
    setPassword(value);

    if (!validPasswordLength(value)) {
      setPasswordError("رمز عبور باید بیشتر از ۱۲ کاراکتر باشد.");
      setPasswordIsValid(false);
    } else if (!validPasswordSpecialChar(value)) {
      setPasswordError("رمز عبور باید حداقل یک کاراکتر خاص داشته باشد.");
      setPasswordIsValid(false);
    } else if (!validPasswordNumber(value)) {
      setPasswordError("رمز عبور باید حداقل یک عدد داشته باشد.");
      setPasswordIsValid(false);
    } else {
      setPasswordError("");
      setPasswordIsValid(true);
    }
  };

  const handlePasswordConfirmationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setPasswordConfirmation(value);

    if (value !== password) {
      setPasswordConfirmationError("رمز عبور مطابقت ندارد.");
      setPasswordConfirmationIsValid(false);
    } else {
      setPasswordConfirmationError("");
      setPasswordConfirmationIsValid(true);
    }
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (
      emailIsValid &&
      usernameIsValid &&
      passwordIsValid &&
      passwordConfirmationIsValid
    ) {
      dispatch(AuthActions.signupRequest({ name: username, password, email }));
    }
  };

  useEffect(() => {
    if (!loading && error === undefined) {
      navigate("/issues");
    }
  }, [loading]);

  return (
    <div className={styles["container-view"]}>
      <div className={styles["header"]}>
        <div
          onClick={() => navigate("/")}
          className={styles["home-button-container"]}
        >
          <HomeButton />
        </div>
        <div className={styles["header-bar"]}>
          <Icon
            light="../../../public/assets/icons/header/header-logo.svg"
            dark="../../../public/assets/icons/header/header-logo-dark.svg"
            className={styles["mobile-logo"]}
          />
        </div>
      </div>
      <div className={styles["body"]}>
        <div className={styles["content"]}>
          <div className={styles["container-form"]}>
            <Icon
              light="../../../public/assets/icons/header/header-logo.svg"
              dark="../../../public/assets/icons/header/header-logo-dark.svg"
              className={styles["desktop-logo"]}
            />
            <form
              noValidate
              className={styles["form"]}
            >
              <TextInput
                value={email}
                onChange={handleEmailChange}
                type="email"
                title={"ایمیل"}
                direction="ltr"
                errorText={emailError}
                hasError={emailError !== ""}
                successText="ایمیل معتبر است."
                isValid={emailIsValid}
              />
              <TextInput
                value={username}
                onChange={handleUsernameChange}
                type="text"
                title="نام"
                errorText={usernameError}
                hasError={usernameError !== ""}
                successText="نام کاربری معتبر است."
                isValid={usernameIsValid}
              />
              <TextInput
                value={password}
                onChange={handlePasswordChange}
                type="password"
                title={"رمز عبور"}
                direction="ltr"
                successText="رمز عبور معتبر است."
                isValid={passwordIsValid}
                errorText={passwordError}
                hasError={passwordError !== ""}
              />
              <TextInput
                value={passwordConfirmation}
                onChange={handlePasswordConfirmationChange}
                type="password"
                title={"تکرار رمز عبور"}
                direction="ltr"
                successText="رمز عبور مطابقت دارد."
                isValid={passwordConfirmationIsValid}
                errorText={passwordConfirmationError}
                hasError={passwordConfirmationError !== ""}
              />
            </form>
            {doesExist && (
              <div className={styles["error-container"]}>
                <Icon
                  light="../../../public/assets/icons/TextInput/error-icon.svg"
                  dark="../../../public/assets/icons/TextInput/error-icon.svg"
                  className={styles["error-icon"]}
                />
                <span className={styles["error-message"]}>
                  این ایمیل قبلا ثبت شده است.
                </span>
              </div>
            )}
            <button onClick={handleSubmit} className={styles["submit-button"]}>
              ثبت نام
            </button>
            <button className={styles["login-redirect-button"]}>
              وارد شوید
            </button>
          </div>
          <Icon
            light="../../../public/assets/icons/shared/bale-icon.svg"
            dark="../../../public/assets/icons/shared/bale-icon.svg"
            className={styles["bale-logo"]}
          />
        </div>
        <img
          src="../../../public/assets/images/login-signup.png"
          className={styles["desktop-image"]}
        />
      </div>
    </div>
  );
}
