import React, { useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "@/config";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";

import { FiPlus, FiSend, FiX } from "react-icons/fi";
import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineComment,
  AiOutlineShareAlt,
} from "react-icons/ai";

import styles from "./index.module.css";

export default function DashboardPage() {
  const { user } = useSelector((s) => s.auth || {});

  // ✅ Always resolve user avatar or fallback
  const avatar = useMemo(() => {
    return user?.profilePicture
      ? `${BASE_URL}/${user.profilePicture}`
      : `${BASE_URL}/uploads/default.jpg`; // ✅ FIXED fallback path
  }, [user]);

  const [text, setText] = useState("");
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const imageInputRef = useRef(null);

  const [posts, setPosts] = useState([
    {
      id: 1,
      name: "Apna College 2",
      username: "@apnacollege",
      avatar: `${BASE_URL}/uploads/default.jpg`, // ✅ FIXED here too
      body: "Hello World",
      image: "/sample-post.png",
      likes: 0,
      likedByMe: false,
      comments: [],
    },
  ]);

  const resetComposer = () => {
    setText("");
    setPreview(null);
    setFile(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const onPickImage = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const onSendPost = () => {
    if (!text.trim() && !preview) return;

    const newPost = {
      id: Date.now(),
      name: user?.name || "You",
      username: `@${user?.username || "you"}`,
      avatar,
      body: text.trim(),
      image: preview || null,
      likes: 0,
      likedByMe: false,
      comments: [],
    };
    setPosts((p) => [newPost, ...p]);
    resetComposer();
  };

  const toggleLike = (id) => {
    setPosts((arr) =>
      arr.map((p) =>
        p.id === id
          ? {
              ...p,
              likedByMe: !p.likedByMe,
              likes: p.likedByMe ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
  };

  const addComment = (id, msg) => {
    if (!msg.trim()) return;
    setPosts((arr) =>
      arr.map((p) =>
        p.id === id
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: `${id}-${Date.now()}`,
                  body: msg.trim(),
                  author: user?.name || "You",
                  avatar,
                },
              ],
            }
          : p
      )
    );
  };

  const sharePost = async (post) => {
    const shareText = `${post.name} ${post.username}\n\n${post.body || ""}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Pro Connect", text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert("Post copied to clipboard!");
      }
    } catch (e) {}
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.feed}>
          {/* Composer */}
          <div className={styles.composer}>
            <img src={avatar} alt="me" className={styles.avatar} />
            <div className={styles.composerMain}>
              <textarea
                className={styles.input}
                placeholder="What's on your mind?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={1}
              />
              {preview && (
                <div className={styles.preview}>
                  <img src={preview} alt="preview" />
                  <button
                    className={styles.previewClose}
                    onClick={() => {
                      setPreview(null);
                      setFile(null);
                      if (imageInputRef.current)
                        imageInputRef.current.value = "";
                    }}
                  >
                    <FiX />
                  </button>
                </div>
              )}
              <div className={styles.composerActions}>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={onPickImage}
                />
                <button
                  className={styles.circleBtn}
                  onClick={() => imageInputRef.current?.click()}
                  title="Add image"
                >
                  <FiPlus size={18} />
                </button>
                <button
                  className={styles.sendBtn}
                  onClick={onSendPost}
                  disabled={!text.trim() && !preview}
                  title="Send post"
                >
                  <FiSend size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Feed */}
          <div className={styles.list}>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={() => toggleLike(post.id)}
                onShare={() => sharePost(post)}
                onComment={(msg) => addComment(post.id, msg)}
              />
            ))}
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

function PostCard({ post, onLike, onShare, onComment }) {
  const [comment, setComment] = useState("");
  const likeIcon = post.likedByMe ? (
    <AiFillLike size={18} />
  ) : (
    <AiOutlineLike size={18} />
  );

  return (
    <article className={styles.card}>
      <header className={styles.cardHeader}>
        <img
          src={post.avatar || `${BASE_URL}/uploads/default.jpg`} // ✅ fallback
          alt=""
          className={styles.avatar}
        />
        <div>
          <div className={styles.nameRow}>
            <span className={styles.name}>{post.name}</span>
            <span className={styles.username}>{post.username}</span>
          </div>
        </div>
      </header>

      {post.body && <p className={styles.body}>{post.body}</p>}

      {post.image && (
        <div className={styles.media}>
          <img src={post.image} alt="post media" />
        </div>
      )}

      <div className={styles.actions}>
        <button className={styles.actionBtn} onClick={onLike}>
          {likeIcon}
          <span>{post.likes}</span>
        </button>

        <span className={styles.actionBtnStatic}>
          <AiOutlineComment size={18} />
          <span>{post.comments.length}</span>
        </span>

        <button className={styles.actionBtn} onClick={onShare}>
          <AiOutlineShareAlt size={18} />
          <span>Share</span>
        </button>
      </div>

      {!!post.comments.length && (
        <div className={styles.commentsList}>
          {post.comments.map((c) => (
            <div key={c.id} className={styles.commentItem}>
              <img
                src={c.avatar || `${BASE_URL}/uploads/default.jpg`} // ✅ fallback
                alt=""
                className={styles.commentAvatar}
              />
              <div className={styles.commentBubble}>
                <div className={styles.commentMeta}>
                  <span className={styles.commentAuthor}>{c.author}</span>
                </div>
                <p>{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.commentComposer}>
        <input
          className={styles.commentInput}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment…"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (comment.trim()) {
                onComment(comment);
                setComment("");
              }
            }
          }}
        />
        <button
          className={styles.commentSend}
          onClick={() => {
            if (comment.trim()) {
              onComment(comment);
              setComment("");
            }
          }}
        >
          <FiSend size={16} />
        </button>
      </div>
    </article>
  );
}
