import Navbar from "../../components/Navbar";
import './Profile.css'
import userIcon from '../../assets/userIcon.png'

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <p>You must be logged in to view this page!</p>;
  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-container">
          <h1>Your Profile</h1>
          <img src={user?.profile_image ? `http://127.0.0.1:8000/storage/${user.profile_image}` : userIcon}
            alt="Image" />
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <button onClick={() => (window.location.href = "/edit-profile")}>
            Edit Profile
          </button>
        </div>
      </div>
    </>
  );
}
