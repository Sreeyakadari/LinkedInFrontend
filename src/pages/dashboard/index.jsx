import React, { useState, useRef, useMemo } from "react";
import {
  FaPlus,
  FaPaperPlane,
  FaTimes,
  FaHeart,
  FaRegCommentDots,
  FaShareAlt,
} from "react-icons/fa";
import styles from "./index.module.css";

// Mock current user - in a real app this would come from auth context/redux
const mockUser = {
  id: "1",
  name: "Apna College 2",
  username: "apnacollege",
  profilePicture:
    "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400",
};

export default function SocialDashboard() {
  const avatar = useMemo(() => {
    return (
      mockUser?.profilePicture ||
      "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400"
    );
  }, []);

  const [text, setText] = useState("");
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const imageInputRef = useRef(null);

  const [posts, setPosts] = useState([
    {
      id: 1,
      name: "Apna College 2",
      username: "@apnacollege",
      avatar:
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400",
      body: "Hello World! Welcome to our social platform. Share your thoughts and connect with others.",
      image:
        "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800",
      likes: 5,
      likedByMe: false,
      comments: [
        {
          id: "1-1",
          body: "Great to see this platform growing!",
          author: "User 1",
          avatar:
            "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400",
        },
      ],
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
      name: mockUser?.name || "You",
      username: `@${mockUser?.username || "you"}`,
      avatar,
      body: text.trim(),
      image: preview || undefined,
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
                  author: mockUser?.name || "You",
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
    } catch (e) {
      console.log("Share failed");
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.feed}>
        {/* Composer */}
        <div className={styles.composer}>
          <img src={avatar} alt="Your profile" className={styles.avatar} />
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
                    if (imageInputRef.current) imageInputRef.current.value = "";
                  }}
                >
                  <FaTimes size={16} />
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
                <FaPlus size={18} />
              </button>
              <button
                className={styles.sendBtn}
                onClick={onSendPost}
                disabled={!text.trim() && !preview}
                title="Send post"
              >
                <FaPaperPlane size={18} />
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
              currentUserAvatar={avatar}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PostCard({ post, onLike, onShare, onComment, currentUserAvatar }) {
  const [comment, setComment] = useState("");

  return (
    <article className={styles.card}>
      <header className={styles.cardHeader}>
        <img
          src={
            post.avatar ||
            "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=400"
          }
          alt={post.name}
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
        <button
          className={`${styles.actionBtn} ${
            post.likedByMe ? styles.liked : ""
          }`}
          onClick={onLike}
        >
          <FaHeart color={post.likedByMe ? "#ef4444" : "black"} />
          <span>{post.likes}</span>
        </button>

        <span className={styles.actionBtnStatic}>
          <FaRegCommentDots size={18} />
          <span>{post.comments.length}</span>
        </span>

        <button className={styles.actionBtn} onClick={onShare}>
          <FaShareAlt size={18} />
          <span>Share</span>
        </button>
      </div>

      {!!post.comments.length && (
        <div className={styles.commentsList}>
          {post.comments.map((c) => (
            <div key={c.id} className={styles.commentItem}>
              <img
                src={c.avatar}
                alt={c.author}
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
        <img
          src={currentUserAvatar}
          alt="Your profile"
          className={styles.commentAvatar}
        />
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
          <FaPaperPlane size={16} />
        </button>
      </div>
    </article>
  );
}
