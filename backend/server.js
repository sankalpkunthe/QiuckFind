const express = require("express");
const cors = require("cors");
const fs = require("fs");

const words = JSON.parse(
    fs.readFileSync(
        "./data/words.json",
        "utf-8"
    )
);

console.log(`Loaded ${words.length} words`);


const SearchEngine = require("./search/searchEngine");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

const searchEngine =
    new SearchEngine(words);

app.get("/search", (req, res) => {
    const query = req.query.q || "";
    const start = performance.now();
    const results = searchEngine.search(query, 10);
    const end = performance.now();
    res.json({query, results, time: Number((end - start).toFixed(3)), datasetSize: words.length});
});

app.get("/", (req, res) => {
    res.json({ message: "QuickFind backend is running"});
});

app.listen(PORT, () => {
    console.log(`QuickFind server running on http://localhost:${PORT}`);
});