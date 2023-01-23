require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { PORT } = process.env || 8080;
const usersRoute = require("./routes/users");
const recurringRoute = require("./routes/recurringExpenses");
const flexibleRoute = require("./routes/flexibleExpenses");
const investmentsRoute = require("./routes/investments");
const savingsRoutes = require("./routes/savings");

// Connect server to client
app.use(cors());

// Middleware for POST requests
app.use(express.json());

// Using routes
app.use("/api", usersRoute);
app.use("/api/recurring", recurringRoute);
app.use("/api/flexible", flexibleRoute);
app.use("/api/investments", investmentsRoute);
app.use("/api/savings", savingsRoutes);

app.listen(PORT, () => console.log("Welcome to Budgeter 💰💰💰"));
