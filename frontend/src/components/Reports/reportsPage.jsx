// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Reports.css";
import { PulseLoader } from 'react-spinners';


// eslint-disable-next-line react/prop-types
const ReportsPage = ({ childData }) => {
  const [statistics, setStatistics] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true); // Start loading
      setError('');     // Reset error
      try {
        // eslint-disable-next-line react/prop-types
        const childId = childData?._id || childData?.id;
        const response = await axios.get(`/api/game/statistics/${childId}`);
        setStatistics(response.data);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Failed to fetch statistics. Please try again."); // Handle error
      } finally {
        setLoading(false); // Stop loading
      }
    };
  
    if (childData) fetchStatistics();
  }, [childData]);
  

  return (
    <div className="reports-container">
      <h1>Reports</h1>
      {loading ? (
        <div className="spinner-container">
          <PulseLoader color="#36d7b7" size={15} />
        </div>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : statistics.length === 0 ? (
        <p>No statistics available yet.</p>
      ) : (
        <table className="reports-table">
          <thead>
            <tr>
              <th>Game Type</th>
              <th>Total Correct Answers</th>
              <th>Total Attempts</th>
              <th>Games Played</th>
            </tr>
          </thead>
          <tbody>
            {statistics.map((stat) => (
              <tr key={stat._id}>
                <td>{stat._id}</td>
                <td>{stat.totalCorrect}</td>
                <td>{stat.totalAttempts}</td>
                <td>{stat.gamesPlayed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
  
  
};

export default ReportsPage;
