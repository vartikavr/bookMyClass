require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const secret = process.env.SESSION_SECRET || "thisshouldbeabettersecret";

const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    name: "sid",
    secret,
    cookie: { httpOnly: false, maxAge: oneDay },
    saveUninitialized: false,
    resave: false,
  })
);

const userRoutes = require("./server/routes/users");
const classroomRoutes = require("./server/routes/classrooms");
const classRoutes = require("./server/routes/classes");

app.use(morgan("tiny"));
app.use("/api/", userRoutes); // for user routes
app.use("/api/classrooms", classroomRoutes);
app.use("/api/class", classRoutes);

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/bookMyClass";

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection; // to shorten
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected!");
});

app.use(express.static(path.join(__dirname, "client", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serving at port ${port}!`);
});
