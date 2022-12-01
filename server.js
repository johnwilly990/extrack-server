require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { PORT } = process.env || 8080;
const usersRoute = require("./routes/users");
const expensesRoute = require("./routes/expenses");

// Connect server to client
app.use(cors());

// Middleware for POST requests
app.use(express.json());

// Using routes
app.use("/users", usersRoute);

app.listen(PORT, () => console.log("Welcome to Budgeter 💰💰💰"));
