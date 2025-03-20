const express = require("express");
const path = require("path");
const app = express();

const PORT = 3000;
const staticPath = path.join(__dirname, "../public");

app.use(express.static(staticPath));

app.get("/", (req, res) => {});

app.listen(PORT, () => {
  console.log(`Port: ${PORT}`);
});
