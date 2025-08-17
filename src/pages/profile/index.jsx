import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser, logoutUser } from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import { BASE_URL, clientServer } from "@/config";
import { FaPen, FaTrash } from "react-icons/fa";
import Link from "next/link"; // ✅ added Link import

const Profile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { token, user, isLoading } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.postReducer);

  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputData, setInputData] = useState({
    company: "",
    position: "",
    years: "",
  });
  const [editingField, setEditingField] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    } else {
      dispatch(getAboutUser({ token }));
      dispatch(getAllPosts());
    }
  }, [dispatch, token, router]);

  useEffect(() => {
    if (user) {
      setUserProfile(user);
    }
  }, [user]);

  useEffect(() => {
    if (userProfile && user) {
      const changed =
        userProfile.name !== user.name ||
        userProfile.username !== user.username ||
        userProfile.bio !== user.bio ||
        JSON.stringify(userProfile.pastWork) !== JSON.stringify(user.pastWork);

      setHasChanges(changed);
    }
  }, [userProfile, user]);

  useEffect(() => {
    if (user) {
      const myPosts = (posts || []).filter(
        (p) => p?.userId?.username === user?.username
      );
      setUserPosts(myPosts);
    }
  }, [user, posts]);

  const handleLogout = () => {
    dispatch(logoutUser());
    router.replace("/login");
  };

  const updateProfilePicture = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", token);

    try {
      await clientServer.post("/update_profile_picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(getAboutUser({ token }));
    } catch (e) {
      console.error(e);
    }
  };

  const updateProfileData = async () => {
    try {
      await clientServer.post("/user_update", {
        token,
        name: userProfile.name,
        username: userProfile.username,
      });

      await clientServer.post("/update_profile_data", {
        token,
        bio: userProfile.bio,
        currentPost: userProfile.currentPost,
        pastWork: userProfile.pastWork,
        education: userProfile.education,
      });

      setHasChanges(false);
      dispatch(getAboutUser({ token }));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteWorkEntry = (index) => {
    const updatedWork = [...(userProfile.pastWork || [])];
    updatedWork.splice(index, 1);
    setUserProfile({ ...userProfile, pastWork: updatedWork });
  };

  const handleWorkInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  if (isLoading || !userProfile?.username)
    return <p className={styles.loading}>Loading profile...</p>;

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2>Pro Connect</h2>
        <ul>
          <li>
            <Link href="/dashboard">🏠&nbsp;Scroll</Link>
          </li>
          <li>
            <Link href="/discover">🔍&nbsp;Discover</Link>
          </li>
          <li>
            <Link href="/my_connections">👥&nbsp;My Connections</Link>
          </li>
        </ul>
      </aside>

      <main className={styles.main}>
        <div className={styles.topRight}>
          <span className={styles.profileLink}>Profile</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className={styles.coverWrap}>
          <img
            className={styles.cover}
            src="https://images.unsplash.com/photo-1501973801540-537f08ccae7b?q=80&w=2000&auto=format&fit=crop"
            alt="cover"
          />
          <div className={styles.avatarWrap}>
            <img
              className={styles.avatar}
              src={
                userProfile?.profilePicture
                  ? `${BASE_URL}/${userProfile.profilePicture}`
                  : `${BASE_URL}/uploads/default.jpg`
              }
              alt="profile"
            />
            <input
              id="avatarUpload"
              hidden
              type="file"
              accept="image/*"
              onChange={(e) => updateProfilePicture(e.target.files?.[0])}
            />
          </div>
        </div>

        <div className={styles.profileLayout}>
          <section className={styles.leftCol}>
            <div className={styles.nameRow}>
              {editingField === "name" ? (
                <input
                  className={styles.inputEdit}
                  type="text"
                  value={userProfile?.name || ""}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, name: e.target.value })
                  }
                  onBlur={() => setEditingField(null)}
                  autoFocus
                />
              ) : (
                <h2>{userProfile?.name || ""}</h2>
              )}
              <FaPen
                className={styles.icon}
                onClick={() => setEditingField("name")}
              />

              {editingField === "username" ? (
                <input
                  className={styles.inputEdit}
                  type="text"
                  value={userProfile?.username || ""}
                  onChange={(e) =>
                    setUserProfile({
                      ...userProfile,
                      username: e.target.value,
                    })
                  }
                  onBlur={() => setEditingField(null)}
                  autoFocus
                />
              ) : (
                <span className={styles.username}>
                  @{userProfile?.username || ""}
                </span>
              )}
              <FaPen
                className={styles.icon}
                onClick={() => setEditingField("username")}
              />
            </div>

            <div className={styles.bioSection}>
              {editingField === "bio" ? (
                <textarea
                  className={styles.textareaEdit}
                  value={userProfile?.bio || ""}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, bio: e.target.value })
                  }
                  onBlur={() => setEditingField(null)}
                  rows={3}
                  autoFocus
                />
              ) : (
                <>
                  <p>{userProfile?.bio || "No bio available"}</p>
                  <FaPen
                    className={styles.icon}
                    onClick={() => setEditingField("bio")}
                  />
                </>
              )}
            </div>

            <div className={styles.workHistory}>
              <h4>Work History</h4>
              <div className={styles.workList}>
                {(userProfile.pastWork || []).map((work, index) => (
                  <div key={index} className={styles.workCard}>
                    <div>
                      <p className={styles.workTitle}>
                        {work?.company || "-"}&nbsp;—&nbsp;
                        {work?.position || "-"}
                      </p>
                      {work?.years ? (
                        <span className={styles.workYears}>
                          {work.years} yrs
                        </span>
                      ) : null}
                    </div>
                    <FaTrash
                      className={styles.deleteIcon}
                      onClick={() => deleteWorkEntry(index)}
                    />
                  </div>
                ))}
                <button
                  className={styles.addWorkBtn}
                  onClick={() => setIsModalOpen(true)}
                >
                  + Add Work
                </button>
              </div>
            </div>

            {hasChanges && (
              <button
                className={styles.updateProfileBtn}
                onClick={updateProfileData}
              >
                Update Profile
              </button>
            )}
          </section>

          <section className={styles.rightCol}>
            {/* Hidden on purpose per your request */}
          </section>
        </div>

        {isModalOpen && (
          <div
            className={styles.modalBackdrop}
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Add Work History</h3>
              <input
                type="text"
                name="company"
                placeholder="Company"
                value={inputData.company}
                onChange={handleWorkInputChange}
              />
              <input
                type="text"
                name="position"
                placeholder="Position"
                value={inputData.position}
                onChange={handleWorkInputChange}
              />
              <input
                type="number"
                name="years"
                placeholder="Years"
                value={inputData.years}
                onChange={handleWorkInputChange}
                min="0"
              />
              <button
                onClick={() => {
                  if (
                    inputData.company.trim() &&
                    inputData.position.trim() &&
                    inputData.years.trim()
                  ) {
                    const newPastWork = [
                      ...(userProfile.pastWork || []),
                      inputData,
                    ];
                    setUserProfile({ ...userProfile, pastWork: newPastWork });
                    setInputData({ company: "", position: "", years: "" });
                    setIsModalOpen(false);
                  } else {
                    alert("Please fill all fields");
                  }
                }}
              >
                Add
              </button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
