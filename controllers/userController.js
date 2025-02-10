
require("dotenv").config();

const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const secretKey = process.env.secretKey;

const urlencodedParser = express.urlencoded({ extended: true });

// Аутентификация пользователя
const getLogin = async (req, res) => {
  urlencodedParser(req, res, async () => {
    let username = req.body.EmpMail;
    let password = req.body.EmpPassword;
    try {
      const result = await pool.query(
        "SELECT * FROM Employee WHERE EmpMail = $1",
        [username]
      );
      const employee = result.rows[0];

      if (!employee) {
        console.warn(`Неудачная попытка входа для пользователя: ${username}`);
        return res
          .status(401)
          .json({ message: "Пользователь не найден или неверный пароль" });
      }
      console.log('mail', username);
      console.log('emppass', password);
      console.log('emppass in DB', employee.emppassword);
      console.log('employee', employee);
      const salt = bcrypt.genSaltSync(10);
      bcrypt.hash('aboba', salt, (err, res) => {
        console.log('hash', res);
      });
      const passwordMatch = await bcrypt.compare(password, employee.emppassword);
      console.log(password);
      console.log(employee.emppassword);
      if (!passwordMatch) {
        console.warn(`Неверный пароль для пользователя: ${username}`);
        console.log(password);
        console.log(employee.emppassword);
        return res
          .status(401)
          .json({ message: "Пользователь не найден или неверный пароль" });
      }

      const token = jwt.sign({ empid: employee.empid, positionid: employee.positionid, username: username }, "abracadabra", {
        expiresIn: "2h",
      });

      res.cookie("token", token, {
        maxAge: 2 * 60 * 60 * 1000,
        sameSite: "None",
        secure: true,
      });

      res.cookie("username", username, {
        maxAge: 2 * 60 * 60 * 1000,
        sameSite: "None",
        secure: true,
      });

      res.cookie("empid", employee.empid, {
        maxAge: 2 * 60 * 60 * 1000,
        sameSite: "None",
        secure: true,
      });
      res.cookie("positionid", employee.positionid, {
        maxAge: 2 * 60 * 60 * 1000,
        sameSite: "None",
        secure: true,
      });

      console.log("cookie username", req.cookies.username);
      console.log("cookie id", req.cookies.empid);
      res.redirect("/");
    } catch (error) {
      console.error("Ошибка при аутентификации", error);
      res.status(500).send("Ошибка при аутентификации");
    }
  });
};

const getRedirectHome = async (req, res) => {
  if (req.cookies && req.cookies.token && req.cookies.username) {
    const employee = req.cookies.username;
    res.send(`С возвращением, ${employee}!`);
    var decoded = jwt.verify(req.cookies.token, 'abracadabra');
    console.log(decoded.empid);
  } else {
    res.send("Пожалуйста, войдите в систему, чтобы просмотреть эту страницу!");
  }
};
const path = require("path");
const publicPath = path.join(__dirname, "public");
const checkcookie = async (req, res) => {
  if (req.cookies && req.cookies.token && req.cookies.username) {
    res.sendFile(path.join(publicPath, "homepage.html"));
  } else {
    res.redirect('http://localhost:3001/login');
  }
}
function checkempid() {
  if (req.cookies && req.cookies.token && req.cookies.username) {
    var decoded = jwt.verify(req.cookies.token, 'abracadabra');
    return decoded.empid;
  } else return null;

}

module.exports = {
  getLogin,
  getRedirectHome,
  checkcookie,
  checkempid
};

