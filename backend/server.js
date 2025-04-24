const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const DB = process.env.MONGO_URI;
// Database Connection
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log("DB Connection Successful");
    })
    .catch((err) => {
      console.log("DB Connection Error:", err.message);
    });

app.use("/api/interviews", require("./routes/InterviewRoute"));
app.use("/api/questions", require("./routes/QuestionsRoute"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
