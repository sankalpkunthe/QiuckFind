import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [searchTime, setSearchTime] = useState(null);
    const [datasetSize, setDatasetSize] = useState(null);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setSearchTime(null);
            setDatasetSize(null);
            return;
        }

        const controller = new AbortController();

        const timer = setTimeout(async () => {
            try {
                const response = await fetch(`http://localhost:5000/search?q=${encodeURIComponent(query)}`, {signal: controller.signal});
                const data = await response.json();

                setResults(data.results);
                setSearchTime(data.time);
                setDatasetSize(data.datasetSize);

            } catch(error) {
                if(error.name !== "AbortError") console.error("Search failed:", error);
            }
        }, 150);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [query]);

    return (
        <div className="container">
            <div className="header">
                <h1>QuickFind</h1>
            </div>

            <div className="search-wrapper">
                <div className="search-box-container">
                    <span className="search-icon">
                        ⌕
                    </span>

                    <input
                        className="search-box"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search"
                    />

                </div>

                {results.length > 0 && (
                    <div className="results">
                        {results.map((result) => (
                            <div
                                className="result"
                                key={result.word}
                            >

                                <div>
                                    <div className="word">
                                        {result.word}
                                    </div>
                                    
                                    <div className="meta">
                                        <span
                                            className={`badge ${result.type === "prefix" ? "badge-prefix" : "badge-fuzzy"}`}
                                        >
                                            {result.type}
                                        </span>

                                        {result.distance > 0 &&
                                            `Distance: ${result.distance}`
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {query.trim() &&
                    searchTime !== null &&
                    results.length === 0 && (
                        <div className="no-results">
                            No matching results found.
                        </div>
                    )}
            </div>

            {searchTime !== null && (
                <div className="benchmark">
                    <div className="benchmark-header">
                        <h3>
                            Performance
                        </h3>

                        <div className="performance-time">
                            Search time:{" "}
                            <strong>
                                {searchTime} ms
                            </strong>
                        </div>
                    </div>

                    <div className="performance-grid">
                        <div className="stat">
                            <div className="stat-label">
                                Dataset
                            </div>

                            <div className="stat-value">
                                {datasetSize?.toLocaleString("en-IN")}{" "} words
                            </div>
                        </div>

                        <div className="stat">
                            <div className="stat-label">
                                Query
                            </div>

                            <div className="stat-value">
                                {query}
                            </div>
                        </div>

                        <div className="stat">
                            <div className="stat-label">
                                Results
                            </div>

                            <div className="stat-value">
                                {results.length}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;