import styles from "./Logout.module.scss";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { AuthActions, logoutRequest } from "../../state/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Logout = ({ isOpen, onClose }: { isOpen: boolean; onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.userSlice.userId);
  const handleLogout = () => {
    dispatch(AuthActions.logoutRequest());
  };
  useEffect(() => {
    if (userId === "") {
      onClose();
      navigate("/login");
    }
  }, [userId]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.overlay}>
      <div className={styles["box"]}>
        <div className={styles["header"]}>خروج از حساب کاربری</div>
        <div className={styles["text"]}>
          آیا از خروج از حساب کاربری خود اطمینان دارید؟
        </div>
        <div className={styles["buttons"]}>
          <button onClick={handleLogout} className={styles["logout"]}>
            خروج
          </button>
          <button onClick={onClose} className={styles["cancel"]}>
            انصراف
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root") 
  );
};

export default Logout;
