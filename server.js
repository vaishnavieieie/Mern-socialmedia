const express = require("express");
const connectDB = require("./config/db");

const app = express();

const PORT = process.env.PORT || 5000;

//connect db:
connectDB();

//init middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.send("HEEYYLOO");
});

//define routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/auth", require("./routes/api/auth"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
