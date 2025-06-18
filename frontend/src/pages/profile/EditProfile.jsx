import { useState, useEffect } from "react";
import axios from "axios";
import "./EditProfile.css";
import { useNavigate } from "react-router";
import userIcon from "../../assets/userIcon.png";

export default function EditProfile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profile_image: null,
  });

  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
      setFormData((prev) => ({
        ...prev,
        name: userData.name,
        email: userData.email,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_image") {
      setFormData({ ...formData, profile_image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password } = formData;

    const hasUppercase = /[A-Z]/.test(password);
    const isLongEnough = password.length >= 8;

    if (!hasUppercase || !isLongEnough) {
      setError(
        "Password must be at least 8 characters long and contain at least one uppercase letter."
      );
      return;
    }

    const token = localStorage.getItem("auth_token");
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    if (formData.password) {
      data.append("password", formData.password);
      data.append("password_confirmation", formData.confirmPassword);
    }
    if (formData.profile_image) {
      data.append("profile_image", formData.profile_image);
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/user/update",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Profile updated successfully");
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.reload();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Registration Failed";
      setError(msg);
    }
  };

  return (
    <>
      <div className="edit-profile-page">
        <div className="editing-profile">
          <div className="profile-container-edit">
            <h1>Your Previous Profile</h1>
            <img
              src={
                user?.profile_image
                  ? `http://127.0.0.1:8000/storage/${user.profile_image}`
                  : userIcon
              }
              alt="profile"
            />
            <p>Name: {user?.name}</p>
            <p>Email: {user?.email}</p>

            <div className="back-button-edit-profile">
              <button onClick={() => navigate(-1)}>← Back</button>
            </div>
          </div>

          <div className="edit-form">
            <h1>Your New Profile</h1>
            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Edit your Name:</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label htmlFor="email">Edit your Email:</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {error && (
                <p style={{ color: "red", fontSize: "12px" }}>{error}</p>
              )}
              <label htmlFor="password">Change your Password:</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="New Password"
                onChange={handleChange}
              />

              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                onChange={handleChange}
              />

              <label htmlFor="profile_image">Upload Profile Image:</label>
              <input
                id="profile_image"
                name="profile_image"
                type="file"
                accept="image/*"
                onChange={handleChange}
              />

              <button type="submit">Confirm Edit</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
