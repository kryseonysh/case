const express = require('express');
const jwt = require("jsonwebtoken");
const dataRoutes = require("./routes/dataRouter");
const userRoutes = require("./routes/userRouter");
const cookieParser = require("cookie-parser");
const path = require("path");
const publicPath = path.join(__dirname, "public");
const app = express();
app.use(express.static(publicPath));
app.use(cookieParser());
app.use(express.json());
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "homepage.html"));
});
app.get("/profile", (req, res) => {
  res.sendFile(path.join(publicPath, "profile.html"));
});
app.get("/test/:testid", (req, res) => {
  res.sendFile(path.join(publicPath, "test.html"));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(publicPath, "login.html"));
});
app.get("/tests", (req, res) => {
  res.sendFile(path.join(publicPath, "tests.html"));
});
app.get("/hr", (req, res) => {
  const decod = jwt.verify(req.cookies.token, 'abracadabra', function (err, decoded) {
    if (err) res.sendFile(path.join(publicPath, "nothr.html"));
    else {
      if (parseInt(decoded.positionid) == 3) {
        res.sendFile(path.join(publicPath, "hr.html"));
      }
      else res.sendFile(path.join(publicPath, "nothr.html"));
    }
  });
});
app.get("/hr/profile/:empid", (req, res) => {
  res.sendFile(path.join(publicPath, "profilehr.html"));
});
app.get("/reviews", (req, res) => {
  const decod = jwt.verify(req.cookies.token, 'abracadabra', function (err, decoded) {
    if (err) res.sendFile(path.join(publicPath, "notreviews.html"));
    else {
      if (decoded.empid) {
        res.sendFile(path.join(publicPath, "reviews.html"));
      }
    }
  });
});

app.get("/materials", (req, res) => {
  res.sendFile(path.join(publicPath, "materials.html"));
});
app.get("/logout", (req, res) => {
  res.clearCookie("empid"); 
  res.clearCookie("positionid");
  res.clearCookie("token");
  res.clearCookie("username");
  res.redirect('http://localhost:3001');
});
require("dotenv").config();
const port = process.env.port;
app.listen(port, () => console.log('Сервер запущен! ${port}'));
app.use('/api', dataRoutes);
app.use('/login', userRoutes);