const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");

const jwtPass = "1234";

mongoose.connect("mongodb://localhost:27017/garvit");

const users = mongoose.model("users", {
  name: String,
  email: String,
  password: String,
});

const port = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

function checkAuth(req, res, next) {
  let token = req.headers.authorization;
  if (!token) {
    return res.redirect("/");
  }
  try {
    console.log("Verified");
    let decoded = jwt.verify(token, jwtPass);
    next();
  } catch (error) {
    console.log("cant verify");
    return res.redirect("/");
  }
}

app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/dashboard", checkAuth, (req, res) => {
  return res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.post("/login", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  let user = await users.findOne({ email: email, password: password });

  if (user) {
    let token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      jwtPass
    );
    return res.json({
      success: true,
      token: token,
    });
  } else {
    return res.json({
      success: false,
    });
  }
});

app.post("/signup", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const user = new users({
    name,
    email,
    password,
  });
  try {
    const response = await user.save();
    return res.json({
      success: true,
    });
  } catch (error) {
    return res.json({
      success: false,
    });
  }
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
