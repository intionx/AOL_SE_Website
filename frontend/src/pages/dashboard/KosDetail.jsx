import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import axios from "axios";
import Flickity from "react-flickity-component";
import "./KosDetail.css";
import "flickity/css/flickity.css";
import Navbar from "../../components/Navbar";
import whatsappIcon from "../../assets/whatsapp.png";
import messageIcon from "../../assets/message.png";
import linkIcon from "../../assets/link.png";
import { useNavigate } from "react-router";

export default function KosDetail() {
  const { id } = useParams();
  const [kos, setKos] = useState(null);
  const [reviews, setReviews] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("auth_token");
  const flickityRef = useRef(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/kos/${id}`)
      .then((response) => {
        setKos(response.data);
        setReviews(response.data.reviews || []);
      })
      .catch((err) => {
        console.error("Failed to fetch: ", err);
      });
  }, [id]);

  const copyPageLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => alert("Page link copied to clipboard!"))
      .catch((err) => console.error("Failed to copy:", err));
  };

  const handleReview = async () => {
    if (rating < 1 || rating > 5) {
      setError("Rating must be between 1 and 5.");
      return;
    }
    try {
      const token = localStorage.getItem("auth_token");
      const response = await axios.post(
        `http://127.0.0.1:8000/api/kos/${id}/review`,
        {
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReviews((prev) => [...prev, response.data]);
      setRating(5);
      setComment("");
    } catch (err) {
      console.error(err);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <>
        {"★".repeat(fullStars)}
        {halfStar ? "½" : ""}
        {"☆".repeat(emptyStars)}
      </>
    );
  };

  if (!kos) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="back-button-dashboard">
        <button onClick={() => navigate("/dashboard")}>&larr; Back</button>
      </div>
      <div className="dorm-body">
        <div className="dorm-detail">
          <div className="dorm-title">
            <h1>{kos.name}</h1>
            <h2>{renderStars(averageRating)}</h2>
            <h3>{reviews.length} Reviews</h3>
            <Flickity
              flickityRef={(c) => (flickityRef.current = c)}
              className="gallery"
              elementType="div"
              options={{
                wrapAround: true,
                cellAlign: "left",
                contain: true,
                imagesLoaded: true,
              }}
              reloadOnUpdate
            >
              {kos.images.map((img, idx) => (
                <div className="gallery-cell" key={idx}>
                  <img
                    src={`http://127.0.0.1:8000/storage/${img}`}
                    alt={`Slide ${idx + 1}`}
                  />
                </div>
              ))}
            </Flickity>
            <div className="reviews-below-gallery">
              <p className="review-title">
                <strong>Reviews</strong>
              </p>
              {reviews.length > 0 ? (
                reviews.map((rev, idx) => (
                  <div className="review-card" key={idx}>
                    <p className="review-user">
                      {rev.user?.name || "Anonymous"}
                    </p>
                    <p className="review-rating">⭐ {rev.rating}/5</p>
                    <p className="review-comment">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="no-review">No reviews yet.</p>
              )}
            </div>
          </div>

          <div className="page-split"></div>

          <div className="dorm-info">
            <p>
              <strong>Address:</strong> {kos.address}
            </p>
            <p>
              <strong>Includes:</strong> {kos.includes.join(", ")}
            </p>
            <p>
              <strong>Nearby Facilities:</strong>
            </p>
            <ul>
              {kos.nearby_facilities.map((fac, idx) => (
                <li key={idx}>{fac}</li>
              ))}
            </ul>
            <h1>
              Rp. {Number(kos.price_per_month).toLocaleString("id-ID")}/month
            </h1>
            <hr />
            <p>
              <strong>Contact Information</strong>
            </p>
            <div
              className="whatsapp"
              onClick={() => window.open(kos.contact_whatsapp, "_blank")}
            >
              <img src={whatsappIcon} alt="whatsapp-logo" />
              <p>Whatsapp</p>
            </div>
            <div
              className="send-message"
              onClick={() => window.open(kos.contact_whatsapp, "_blank")}
            >
              <img src={messageIcon} alt="message-logo" />
              <p>Send Message</p>
            </div>
            <div className="share" onClick={copyPageLink}>
              <img src={linkIcon} alt="share-logo" />
              <p>Copy Link</p>
            </div>
            <hr />

            {isLoggedIn ? (
              <div className="review-section">
                <div className="review-form">
                  <h3>Leave a Review</h3>
                  {error && (
                    <p style={{ color: "red", fontSize: "12px" }}>{error}</p>
                  )}
                  <label>Rating (1–5):</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                  />
                  <label>Comment:</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="Share your thoughts..."
                  />
                  <button onClick={handleReview}>Submit Review</button>
                </div>
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
                to submit a review.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
