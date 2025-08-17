import React, { useEffect } from "react";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { getAboutUser } from "@/config/redux/action/authAction";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      router.push("/login");
      return;
    }

    dispatch(getAboutUser({ token }));
  }, [dispatch, router]);

  return (
    <div>
      <div className="container">
        <div className={styles.homeContainer}>
          <div className={styles.homeContainer__leftBar}>
            {/* --- Sidebar header (logo / brand) --- */}
            <div
              className={styles.sideBarOption}
              onClick={() => router.push("/dashboard")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125A1.125 1.125 0 0 0 5.625 21h12.75A1.125 1.125 0 0 0 19.5 19.875V9.75"
                />
              </svg>
              <p>Scroll</p>
            </div>

            {/* --- Discover --- */}
            <div
              onClick={() => router.push("/discover")}
              className={styles.sideBarOption}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <p>Discover</p>
            </div>

            {/* --- My Connections --- */}
            <div
              onClick={() => router.push("/my_connections")}
              className={styles.sideBarOption}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9 9 0 1 0-12 0M15 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              <p>My Connections</p>
            </div>

            {/* --- Profile --- */}
            <div
              onClick={() => router.push("/profile")}
              className={styles.sideBarOption}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              <p>Profile</p>
            </div>
          </div>

          {/* --- Main Feed --- */}
          <div className={styles.homeContainer__feedContainer}>{children}</div>

          {/* --- Right Sidebar (empty for now) --- */}
          <div className={styles.homeContainer__extraContainer}></div>
        </div>
      </div>
    </div>
  );
}
