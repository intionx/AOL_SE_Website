import { useState } from "react";
import axios from "axios";
import "./Submission.css";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router";

export default function SubmitKos() {
  const [form, setForm] = useState({
    name: "",
    location: "",
    contact: "",
    description: "",
  });

  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setError("");

    try {
      await axios.post("http://127.0.0.1:8000/api/kos-submissions", form);
      setSuccessMessage("Kos submitted successfully!");
      setForm({ name: "", location: "", contact: "", description: "" });
    } catch (err) {
      console.error(err);
      setError("Submission failed. Please try again.");
    }
  };

  return (
    <>
      <div className="submission-body">
        <div className="submit-dorm-container">
          <div className="submit-dorm-card">
            <div className="card-back-button">
              <button onClick={() => navigate("/dashboard")}>← Back</button>
            </div>

            <h2>Can't Find a Kos?</h2>
            <p>Submit the details below and we'll look into it!</p>

            {successMessage && <p className="success">{successMessage}</p>}
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit} className="submit-dorm-form">
              <input
                type="text"
                name="name"
                placeholder="Kos Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={form.location}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="contact"
                placeholder="Contact Information"
                value={form.contact}
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                placeholder="Describe the kos..."
                value={form.description}
                onChange={handleChange}
                required
              />
              <button type="submit">Submit Kos</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
