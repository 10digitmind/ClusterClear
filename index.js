const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRoutes = require("./Route/authRoute");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "*", // for now (later restrict)
  methods: ["GET", "POST"],
  credentials: true
}));
app.use("/api", authRoutes);

app.get("/", (req, res) => {
  res.send("Customer retention API running");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('connected to database');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
  });