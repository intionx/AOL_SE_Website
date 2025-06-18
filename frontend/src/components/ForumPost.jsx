import { Link } from "react-router";

export default function ForumPost({ id, user, image, title, content }) {
    
    return (
    <Link to={`/forum/${id}`}>
      <div className="forum-section">
        <div className="forum-user">
          <img src={image}
            alt="profile" />
          <strong>{user}</strong>
        </div>
        <div className="forum-content">
          <h2>{title}</h2>
          <p>{content}</p>
        </div>
        <hr />
      </div>
    </Link>
  );
}
