// File: src/pages/login.jsx

import React, { useState, useEffect } from "react";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";
import styles from "./style.module.css";

const LoginComponent = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loggedIn, profileFetched, isError, message } = useSelector(
    (state) => state.auth
  );

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    dispatch(emptyMessage());
  }, [isLogin, dispatch]);

  useEffect(() => {
    if (loggedIn && profileFetched) {
      router.replace("/dashboard");
    }
  }, [loggedIn, profileFetched, router]);

  const handleSubmit = () => {
    if (isLogin) {
      dispatch(loginUser({ email, password }));
    } else {
      dispatch(registerUser({ username, name, email, password }));
    }
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer__left}>
            <h2>{isLogin ? "Sign In" : "Sign Up"}</h2>
            <p style={{ color: isError ? "red" : "green" }}>
              {message.message}
            </p>
            {!isLogin && (
              <>
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className={styles.inputField}
                />
                <input
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className={styles.inputField}
                />
              </>
            )}
            <input
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={styles.inputField}
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className={styles.inputField}
            />
            <div onClick={handleSubmit} className={styles.buttonWithOutline}>
              <p>{isLogin ? "Sign In" : "Sign Up"}</p>
            </div>
          </div>
          <div className={styles.cardContainer__right}>
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <div
              onClick={() => setIsLogin(!isLogin)}
              className={styles.buttonWithOutline}
            >
              <p>{isLogin ? "Sign Up" : "Sign In"}</p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default LoginComponent;
