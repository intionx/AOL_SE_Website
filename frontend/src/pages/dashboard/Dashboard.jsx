import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { Link } from "react-router";
import "./Dashboard.css";
import searchIcon from "../../assets/icons8-search.svg";

export default function Dashboard() {
  const [kos, setKos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: "",
    capacity: "",
    fromMonth: "",
    toMonth: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/kos")
      .then((response) => {
        setKos(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch kos: ", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = async () => {
    try {
      const params = {};

      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.capacity) params.capacity = filters.capacity;

      const response = await axios.get("http://127.0.0.1:8000/api/kos", {
        params,
      });
      setKos(response.data);
    } catch (error) {
      console.error("Search Failed", error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDorms = kos.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(kos.length / itemsPerPage);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <Navbar />
      <div className="search-bar">
        <input
          type="text"
          name="keyword"
          placeholder="Keyword"
          value={filters.keyword}
          onChange={handleChange}
        />
        <div className="vl" />
        <select
          name="capacity"
          value={filters.capacity}
          onChange={handleChange}
        >
          <option value="">Capacity</option>
          <option value="1">1 Person</option>
          <option value="2">2 People</option>
          <option value="3">3 People</option>
          <option value="4">4+ People</option>
        </select>
        <div className="vl" />
        <select
          name="fromMonth"
          value={filters.fromMonth}
          onChange={handleChange}
        >
          <option value="">From Month</option>
          {monthOptions()}
        </select>
        <div className="vl" />
        <select name="toMonth" value={filters.toMonth} onChange={handleChange}>
          <option value="">To Month</option>
          {monthOptions()}
        </select>
        <div className="vl" />
        <button onClick={handleSearch}>
          <img src={searchIcon} alt="Search" />
        </button>
      </div>
      <div className="dorm-list">
        {loading ? (
          <p>Loading dorms...</p>
        ) : currentDorms.length === 0 ? (
          <p>No kos found.</p>
        ) : (
          currentDorms.map((dorm) => (
            <Link to={`/kos/${dorm.id}`} key={dorm.id}>
              <div className="dorm-card">
                <img
                  src={`http://127.0.0.1:8000/storage/${dorm.images[0]}`}
                  alt={dorm.name}
                />
                <h3>{dorm.name}</h3>
                <p>Location: {dorm.location}</p>
                <p>
                  {dorm.includes.slice(0, 3).join(" • ")}
                  {dorm.includes.length > 3 && " • ..."}
                </p>
                <p>
                  Rp {Number(dorm.price_per_month).toLocaleString("id-ID")}
                  /month
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
      <div className="pagination-container">
        <div className="page-numbers">
          <button
            className="pagination-btn"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <span
              key={i + 1}
              className={`page-number ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => goToPage(i + 1)}
            >
              {i + 1}
            </span>
          ))}

          <button
            className="pagination-btn"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        <div className="items-per-page">
          <label htmlFor="items-select">Show per page: </label>
          <select
            id="items-select"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
      <div className="bottom-msg">
        <p>Missing a kos? Let us know!</p>
        <button onClick={() => (window.location.href = "/submit-kos")}>
          Submit a Request
        </button>
      </div>
    </>
  );
}

function monthOptions() {
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ].map((m) => (
    <option key={m} value={m}>
      {m}
    </option>
  ));
}
