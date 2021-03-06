// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require("morgan");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect(() => {
  console.log("database connected");
});

app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  "/styles",
  sass({
    src: __dirname + "/styles",
    dest: __dirname + "/public/styles",
    debug: true,
    outputStyle: "expanded",
  })
);
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");

//require the route from database.js
const database = require("./routes/database");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own

app.use("/users", usersRoutes(database));

// Note: mount other resources here, using the same pattern above

// login
app.get("/login/:id", (req, res) => {
  req.session.user_id = req.params.id;
  res.redirect("/");
});

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  const user = { user_id: 1, user_name: "Anne Parks" };
  database
    .getTodo(user)
    .then((data) => {
      const userTodoLists = data;
      database.getAllCategories().then((result) => {
        const types = result;
        res.render("index", { userTodoLists, types, user });
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
