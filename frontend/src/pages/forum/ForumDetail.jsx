import { useParams } from "react-router";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import "./ForumDetail.css";

export default function ForumDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState([]);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("auth_token");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/posts/${id}`)
      .then((response) => {
        setPost(response.data);
        setReplies(response.data.replies || []);
      })
      .catch((err) => {
        setError("Failed to Load Post:", err);
      });
  }, [id]);

  const handleReply = async () => {
    if (!reply.trim()) {
      setError("Please fill in your reply before submitting.");
      return;
    }
    try {
      const token = localStorage.getItem("auth_token");
      const response = await axios.post(
        `http://127.0.0.1:8000/api/posts/${id}/reply`,
        {
          body: reply,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReplies((prev) => [...prev, response.data]);
      setReply("");
      setError("");
    } catch (err) {
      console.error(err);
      alert("Reply Failed :", error);
    }
  };

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="forum">
          <p>Loading post...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="fd-body">
        <div className="forum">
          <div className="back-button">
            <button onClick={() => navigate("/forum")}>&larr; Back</button>
          </div>
          <div className="forum-section">
            <div className="forum-user">
              <img
                src={`http://127.0.0.1:8000/storage/${post.user.profile_image}`}
                alt="profile"
              />
              <strong>@{post.user?.name || "unknown"}</strong>
            </div>
          </div>
          <div className="forum-content">
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </div>
          <hr />
          {error && <p style={{ color: "red", fontSize: "12px", marginBottom: "-10px" }}>{error}</p>}
          {isLoggedIn ? (
            <div className="reply-forum">
              <input
                type="text"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="What are your thoughts?"
                required
              />
              <button onClick={handleReply}>Reply</button>
            </div>
          ) : (
            <p
              style={{
                textAlign: "center",
                fontStyle: "italic",
                marginBottom: "10px",
              }}
            >
              Please{" "}
              <span
                style={{ color: "#007BFF", cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                log in
              </span>{" "}
              to reply.
            </p>
          )}

          {replies.map((rep, index) => (
            <div className="reply-section" key={index}>
              <div className="reply-user">
                <img
                  src={`http://127.0.0.1:8000/storage/${rep.user?.profile_image}`}
                  alt="profile"
                />
                <p>
                  <strong>@{rep.user?.name || "anonymous"}:</strong> {rep.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
