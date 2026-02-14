import { useState, useEffect } from "react";
import TextInput from "../../components/TextInput/TextInput";
import HomeButton from "../../components/HomeButton/HomeButton";
import styles from "./Login.module.scss";
import Icon from "../../components/Icon/Icon";
import { AuthActions } from "../../state/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const error = useSelector((state: RootState) => state.authSlice.error);
  const wrongData = error === "Email or password is not correct!";
  const loading = useSelector((state: RootState) => state.authSlice.isLoading);

  const handleEmailChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setPassword(value);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    dispatch(AuthActions.loginRequest({ password, email }));
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
              />
              <TextInput
                value={password}
                onChange={handlePasswordChange}
                type="password"
                title={"رمز عبور"}
                direction="ltr"
              />
            </form>
            {wrongData && (
              <div className={styles["error-container"]}>
                <Icon
                  light="../../../public/assets/icons/TextInput/error-icon.svg"
                  dark="../../../public/assets/icons/TextInput/error-icon.svg"
                  className={styles["error-icon"]}
                />
                <span className={styles["error-message"]}>
                  ایمیل یا رمز عبور اشتباه است.
                </span>
              </div>
            )}
            <button onClick={handleSubmit} className={styles["submit-button"]}>
              ورود
            </button>
            <button className={styles["login-redirect-button"]}>
              ثبت نام کنید
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
