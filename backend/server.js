const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// middleware
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// connect DB
connectDB();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// test
app.get("/", (req, res) => {
  res.send("API is running...");
});

// error handler
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});