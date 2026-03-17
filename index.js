const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')
const authRoutes = require("./Route/authRoute");
const app = express();

dotenv.config();





app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", authRoutes);
app.use(cors());

app.get("/", (req, res) => {
  res.send("Customer retention API running");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL) 
  
  .then(() => {
    console.log('connected the to database')
  
    app.listen(PORT, () => {
      console.log(`HTTPS server running on https://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
    console.error("Database connection error:", error.message);
  });
  