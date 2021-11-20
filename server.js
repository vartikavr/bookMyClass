require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

global.currentUser = null; //contains info of user, if logged in

const userRoutes = require("./server/routes/users");
const classroomRoutes = require("./server/routes/classrooms");
const classRoutes = require("./server/routes/classes");

app.use(morgan("tiny"));
app.use("/", userRoutes); // for user routes
app.use("/classrooms", classroomRoutes);
app.use("/class", classRoutes);

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

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serving at port ${port}!`);
});
