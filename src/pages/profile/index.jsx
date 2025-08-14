import { getAboutUser } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { BASE_URL, clientServer } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import { FaPen, FaTrash } from "react-icons/fa";

export default function ProfilePage() {
  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.postReducer);
  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputData, setInputData] = useState({
    company: "",
    position: "",
    years: "",
  });
  const [editingField, setEditingField] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const handleWorkInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts());
  }, [dispatch]);

  useEffect(() => {
    if (authState.user) {
      setUserProfile(authState.user);
      const myPosts = (postReducer.posts || []).filter(
        (p) => p?.userId?.username === authState.user?.userId?.username
      );
      setUserPosts(myPosts);
    }
  }, [authState.user, postReducer.posts]);

  const updateProfilePictue = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));

    await clientServer.post("/update_profile_picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const updateProfileData = async () => {
    await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
      username: userProfile.userId.username,
    });

    await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      pastWork: userProfile.pastWork,
      education: userProfile.education,
    });

    setHasChanges(false);
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const deleteWorkEntry = (index) => {
    const updatedWork = [...(userProfile.pastWork || [])];
    updatedWork.splice(index, 1);
    setUserProfile({ ...userProfile, pastWork: updatedWork });
  };

  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user?.userId ? (
          <div className={styles.container}>
            {/* Profile Picture */}
            <div className={styles.backDropContainer}>
              <label
                htmlFor="profilePictureUpload"
                className={styles.backDrop__overlay}
              >
                <p>Edit</p>
              </label>
              <input
                onChange={(e) => updateProfilePictue(e.target.files[0])}
                hidden
                type="file"
                id="profilePictureUpload"
              />
              <img
                src={
                  userProfile?.userId?.profilePicture
                    ? `${BASE_URL}/${userProfile.userId.profilePicture}`
                    : "/default-profile.png"
                }
                alt="Profile"
              />
            </div>

            {/* Two-column layout */}
            <div className={styles.profileLayout}>
              {/* Left Column */}
              <div className={styles.leftCol}>
                {/* Name + Username Row */}
                <div className={styles.nameRow}>
                  {editingField === "name" ? (
                    <input
                      className={styles.inputEdit}
                      type="text"
                      value={userProfile?.userId?.name || ""}
                      onChange={(e) => {
                        setUserProfile({
                          ...userProfile,
                          userId: {
                            ...userProfile.userId,
                            name: e.target.value,
                          },
                        });
                        setHasChanges(true);
                      }}
                      onBlur={() => setEditingField(null)}
                    />
                  ) : (
                    <h2>{userProfile?.userId?.name || ""}</h2>
                  )}
                  <FaPen
                    className={styles.icon}
                    onClick={() => setEditingField("name")}
                  />

                  {editingField === "username" ? (
                    <input
                      className={styles.inputEdit}
                      type="text"
                      value={userProfile?.userId?.username || ""}
                      onChange={(e) => {
                        setUserProfile({
                          ...userProfile,
                          userId: {
                            ...userProfile.userId,
                            username: e.target.value,
                          },
                        });
                        setHasChanges(true);
                      }}
                      onBlur={() => setEditingField(null)}
                    />
                  ) : (
                    <span className={styles.username}>
                      @{userProfile?.userId?.username || ""}
                    </span>
                  )}
                  <FaPen
                    className={styles.icon}
                    onClick={() => setEditingField("username")}
                  />
                </div>

                {/* Bio */}
                <div className={styles.bioSection}>
                  {editingField === "bio" ? (
                    <textarea
                      className={styles.textareaEdit}
                      value={userProfile.bio || ""}
                      onChange={(e) => {
                        setUserProfile({ ...userProfile, bio: e.target.value });
                        setHasChanges(true);
                      }}
                      onBlur={() => setEditingField(null)}
                    />
                  ) : (
                    <>
                      <p>{userProfile.bio || "No bio available"}</p>
                      <FaPen
                        className={styles.icon}
                        onClick={() => setEditingField("bio")}
                      />
                    </>
                  )}
                </div>

                {/* Work History */}
                <div className={styles.workHistory}>
                  <h4>Work History</h4>
                  <div className={styles.workHistoryList}>
                    {(userProfile.pastWork || []).map((work, index) => (
                      <div key={index} className={styles.workCard}>
                        <div>
                          <p className={styles.workTitle}>
                            {work.company} - {work.position}
                          </p>
                          <p>{work.years}</p>
                        </div>
                        <FaTrash
                          className={styles.deleteIcon}
                          onClick={() => deleteWorkEntry(index)}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    className={styles.addWorkBtn}
                    onClick={() => setIsModalOpen(true)}
                  >
                    Add Work
                  </button>
                </div>

                {/* Show Update Profile only if text fields change */}
                {hasChanges && (
                  <div
                    onClick={updateProfileData}
                    className={styles.updateProfileBtn}
                  >
                    Update Profile
                  </div>
                )}
              </div>

              {/* Right Column - Recent Activity */}
              <div className={styles.rightCol}>
                <h3>Recent Activity</h3>
                {userPosts.map((post) => (
                  <div key={post._id} className={styles.postCard}>
                    {post.media !== "" && (
                      <img
                        src={`${BASE_URL}/${post.media}`}
                        alt="post"
                        className={styles.postImage}
                      />
                    )}
                    <p>{post.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: "2rem" }}>Loading your profile…</div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div
            onClick={() => setIsModalOpen(false)}
            className={styles.modalBackdrop}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={styles.modalBox}
            >
              <input
                onChange={handleWorkInputChange}
                name="company"
                className={styles.inputField}
                type="text"
                placeholder="Company name"
              />
              <input
                onChange={handleWorkInputChange}
                name="position"
                className={styles.inputField}
                type="text"
                placeholder="Role"
              />
              <input
                onChange={handleWorkInputChange}
                name="years"
                className={styles.inputField}
                type="number"
                placeholder="Years of Experience"
              />
              <div
                onClick={() => {
                  setUserProfile({
                    ...userProfile,
                    pastWork: [...(userProfile.pastWork || []), inputData],
                  });
                  setIsModalOpen(false);
                }}
                className={styles.addWorkConfirm}
              >
                Add Work
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}
