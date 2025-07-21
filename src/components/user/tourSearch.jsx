import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

const TourSearch = () => {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      const response = await axios.get(`https://localhost:6703/api/Tour/search?query=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setResults([]);
    }
  };

  const goToDetail = (id) => {
    navigate(`/tour/${id}`);
  };

  return (
   <div className="search-box">
  <form onSubmit={handleSearch} className="search-form">
    <input
      type="text"
      placeholder="Ne tür bir tatil istersiniz?"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      aria-label="Arama"
      className="search-input"
    />
    <button type="submit" className="search-button" aria-label="Ara">
      <i className="bi bi-search"></i>
    </button>
  </form>

  {results.length > 0 && (
    <ul className="search-results">
      {results.map((tour) => (
        <li
          key={tour.id}
          onClick={() => goToDetail(tour.id)}
          className="search-result-item"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              goToDetail(tour.id);
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`Detay için ${tour.title} turuna git`}
        >
          {tour.title}
        </li>
      ))}
    </ul>
  )}
</div>

  );
};

export default TourSearch;
