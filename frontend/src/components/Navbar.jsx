import { Link, useNavigate } from "react-router";
import axios from "axios";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("auth_token");

  const handleLogout = async () => {
    const token = localStorage.getItem("auth_token");
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      console.error("Logout Failed: ", err);
    }
  };

  return (
    <div className="navbar">
      <div className="nav-left">
        <Link to="/dashboard">KosFinder</Link>
      </div>
      <div className="nav-right">
        <Link to="/forum">Forum</Link>
        {isLoggedIn ? (
          <>
            <Link to="/profile">Profile</Link>
            <span onClick={handleLogout} className="nav-link">
              Logout
            </span>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}
