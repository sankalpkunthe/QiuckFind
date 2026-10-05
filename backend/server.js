const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

app.get("/", (req, res) => {
    res.json({
        message: "QuickFind backend is running."
    });
});

app.listen(PORT, () => {
    console.log(`QuickFind sever running on http://localhost:${PORT}`);
});