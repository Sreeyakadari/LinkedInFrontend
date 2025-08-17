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
    console.log("Login state →", { loggedIn, profileFetched });
    if (loggedIn && profileFetched) {
      router.replace("/dashboard");
    }
  }, [loggedIn, profileFetched, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
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
            <h2 className={styles.cardleft__heading}>
              {isLogin ? "Sign In" : "Sign Up"}
            </h2>
            {message?.message && (
              <p style={{ color: isError ? "red" : "green" }}>
                {message.message}
              </p>
            )}

            <form onSubmit={handleSubmit} className={styles.inputContainer}>
              {!isLogin && (
                <>
                  <input
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className={styles.inputField}
                    required
                  />
                  <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className={styles.inputField}
                    required
                  />
                </>
              )}
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={styles.inputField}
                required
              />
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={styles.inputField}
                required
              />
              <button type="submit" className={styles.button}>
                {isLogin ? "Sign In" : "Sign Up"}
              </button>
            </form>
          </div>

          <div className={styles.cardContainer__right}>
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className={styles.buttonAlt}
              type="button"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default LoginComponent;
