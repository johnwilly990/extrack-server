require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { PORT } = process.env || 8080;

// Connect server to client
app.use(cors());

// Middleware for POST requests
app.use(express.json());

app.listen(PORT, () => console.log("Welcome to Budgeter 💰💰💰"));
