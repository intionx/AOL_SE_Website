import Navbar from "../../components/Navbar";
import ForumPost from "../../components/ForumPost";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import "./Forum.css";
import { useNavigate } from "react-router";

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const isLoggedIn = !!localStorage.getItem("auth_token");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/posts")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Axios error", error);
        setError(error.message || "Something went wrong");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("auth_token");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/posts",
        { title, body },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle("");
      setBody("");
      setError("");

      console.log("Post Created!", response.data);
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Post Failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="forum-body">
        <div className="forum">
          <h1>KosInfo Forum</h1>

          {isLoggedIn ? (
            <div className="add-new-forum">
              {error && <p className="error">{error}</p>}
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Post Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <textarea
                  placeholder="What's Happening?"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                />
                <button type="submit" id="plus-button">
                  +
                </button>
              </form>
            </div>
          ) : (
            <p style={{ textAlign: "center", fontStyle: "italic" }}>
              Please{" "}
              <span
                style={{ color: "#007BFF", cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                log in
              </span>{" "}
              to create a post.
            </p>
          )}

          <hr />
          {posts.length > 0 ? (
            posts.map((post) => (
              <ForumPost
                key={post.id}
                id={post.id}
                user={`@${post.user.name ?? "unknown"}`}
                image={`http://127.0.0.1:8000/storage/${post.user.profile_image}`}
                title={post.title}
                content={post.body}
              />
            ))
          ) : (
            <p className="no-review">No posts yet.</p>
          )}
        </div>
      </div>
    </>
  );
}
