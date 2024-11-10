import React, { useState } from "react";
import axios from "axios"; // Use axios to send API requests

function App() {
  // States for storing URL input, word frequencies, loading state, and top words count
  const [url, setUrl] = useState("");
  const [topN, setTopN] = useState(10); // Default to 10
  const [frequencies, setFrequencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle the form submission and fetch word frequency data from the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Make an API request to the backend to fetch word frequencies for the URL
      const response = await axios.post("http://localhost:5000/api/frequencies", { url, n: topN });
      console.log('Response Data:', response.data);  // Log the response for debugging
      if (response.data && Array.isArray(response.data)) {
        setFrequencies(response.data); // Set word frequencies from response
      } else {
        setError("Invalid response format.");
      }
    } catch (err) {
      setError("An error occurred while fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Word Frequency Analyser</h1>

      {/* Form to input URL and number of top words */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter URL to analyze"
          value={url}
          onChange={(e) => setUrl(e.target.value)} // Update URL state on input change
        />
        <input
          type="number"
          min="1"
          value={topN}
          onChange={(e) => setTopN(e.target.value)} // Update topN state on input change
          placeholder="Top N words"
        />
        <button type="submit" disabled={loading}>Analyze</button>
      </form>

      {/* Display loading state */}
      {loading && <p>Loading...</p>}

      {/* Display error message */}
      {error && <p className="error">{error}</p>}

      {/* Display word frequencies in a table if available */}
      {frequencies.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Word</th>
              <th>Frequency</th>
            </tr>
          </thead>
          <tbody>
            {frequencies.map((item, index) => (
              <tr key={index}>
                <td>{item.word}</td>
                <td>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {/* Handle case when no frequencies are found */}
      {frequencies.length === 0 && <p>No data to display. Please try a different URL.</p>}
    </div>
  );
}

export default App;
