const pool = require("../db");
const queries = require("../queries");
require("dotenv").config();
const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const urlencodedParser = express.urlencoded({ extended: true });
const secretKey = process.env.secretKey;
const get_all_test_results = (req, res) => {
  const id = parseInt(req.params.id);
  if (req.cookies && req.cookies.token && req.cookies.username && ((parseInt(req.cookies.positionid) == 3) || (parseInt(req.cookies.empid) == id))) {
    pool.query(queries.get_all_test_results, [id], (error, results) => {
      if (error) {
        console.error('Error processing request:', error.message);
        return res.status(400).json({ error: error.message });
      }
      res.status(200).json(results.rows);
    });
  } else {
    res.send("У вас нет доступа для просмотра этих данных!");
  }
};

const get_last_test_results = (req, res) => {
  const id = parseInt(req.params.id);
  if (req.cookies && req.cookies.token && req.cookies.username && ((parseInt(req.cookies.positionid) == 3) || (parseInt(req.cookies.empid) == id))) {
    pool.query(queries.get_last_test_results, [id], (error, results) => {
      if (error) {
        console.error('Error processing request:', error.message);
        return res.status(400).json({ error: error.message });
      }
      res.status(200).json(results.rows);
    });
  } else {
    res.send("У вас нет доступа для просмотра этих данных!");
  }
};

const employee_av_marks = (req, res) => {
  if (req.cookies && req.cookies.token && req.cookies.username && (parseInt(req.cookies.positionid) == 3)) {
    pool.query(queries.employee_av_marks, (error, results) => {
      if (error) {
        console.error('Error processing request:', error.message);
        return res.status(400).json({ error: error.message });
      }
      res.status(200).json(results.rows);
    });
  } else {
    res.send("Пожалуйста, войдите в аккаунт HR, чтобы просмотреть эту страницу!");
  }
};

const position_av_marks = (req, res) => {
  if (req.cookies && req.cookies.token && req.cookies.username && (parseInt(req.cookies.positionid) == 3)) {
    pool.query(queries.position_av_marks, (error, results) => {
      if (error) {
        console.error('Error processing request:', error.message);
        return res.status(400).json({ error: error.message });
      }
      res.status(200).json(results.rows);
    });
  } else {
    res.send("Пожалуйста, войдите в аккаунт HR, чтобы просмотреть эту страницу!");
  }
};

const get_test_info_by_id = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.get_test_info_by_id, [id], (error, results) => {
    if (error) {
      console.error('Error processing request:', error.message);
      return res.status(400).json({ error: error.message });
    }
    res.status(200).json(results.rows);
  });
};

const getEmployeeById = (req, res) => {
  const id = parseInt(req.params.id);
  if (req.cookies && req.cookies.token && req.cookies.username && ((parseInt(req.cookies.positionid) == 3) || (parseInt(req.cookies.empid) == id))) {
    pool.query(queries.getEmployeeById, [id], (error, results) => {
      if (error) {
        console.error('Error processing request:', error.message);
        return res.status(400).json({ error: error.message });
      }
      res.status(200).json(results.rows);
    });
  } else {
    res.send("У вас нет доступа для просмотра этих данных!");
  }
};

const get_test_info = (req, res) => {
  const position = parseInt(req.params.position);
  pool.query(queries.get_test_info, [position], (error, results) => {
    if (error) {
      console.error('Error processing request:', error.message);
      return res.status(400).json({ error: error.message });
    }
    res.status(200).json(results.rows);
  });
};

const make_test = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(queries.make_test, [id], (error, results) => {
    if (error) {
      console.error('Error processing request:', error.message);
      return res.status(400).json({ error: error.message });
    }
    res.status(200).json(results.rows);
  });
};

const insert_result = (req, res) => {
  const { typetestid, empid, testresult } = req.body;
  if (req.cookies && req.cookies.token && req.cookies.username && (parseInt(req.cookies.empid) == (parseInt(empid)))) {
    pool.query(
      queries.insert_result,
      [typetestid, empid, testresult],
      (error, results) => {
        if (error) {
          console.error('Error processing request:', error.message);
          return res.status(400).json({ error: error.message });
        } 
        res.status(201).send("Result inserted");
        console.log("Result inserted");
      }
    );
  } else {
    res.send("Вы не можете добавить результаты другому сотруднику!");
  }
};

const recomendation = (req, res) => {
  const typetestid = parseInt(req.params.typetestid);
  const result = parseInt(req.params.result);
  pool.query(queries.recomendation, [typetestid, result], (error, results) => {
    if (error) {
      console.error('Error processing request:', error.message);
      return res.status(400).json({ error: error.message });
    }
    res.status(200).json(results.rows);
  });
};

const add_employee = (req, res) => {
  if (req.cookies && req.cookies.token && req.cookies.username && (parseInt(req.cookies.positionid) == 3)) {
    let empsurname = req.body.EmpSurname;
    let empname = req.body.EmpName;
    let emppatronymic = req.body.EmpPatronymic;
    let empposition = req.body.EmpPosition;
    let empmail = req.body.EmpMail;
    let emppassword = req.body.EmpPassword;
    const salt = bcrypt.genSaltSync(10);
    let emppasswordhash = bcrypt.hashSync(emppassword, salt);
    console.log("hash", emppasswordhash);
    console.log("emp.position", empposition);
    console.log("EmpSurname", empsurname);
    console.log("EmpName", empname);
    try {
      pool.query(
        queries.addEmployee,
        [empsurname, empname, emppatronymic, empposition, empmail, emppasswordhash],
        (error, results) => {
          if (error) {

            console.error('Error processing request:', error.message);
            return res.status(400).json({ error: error.message });
          }
          res.status(201).send("Result inserted");
          console.log("Result inserted");
        }
      );
    } catch (error) {

      console.error('Error processing request:', error.message);
      res.status(400).json({ error: error.message });
    }
  } else {
    res.send("Пожалуйста, войдите в аккаунт HR, чтобы просмотреть эту страницу!");
  }
};

const removeEmployee = (req, res) => {
  if (req.cookies && req.cookies.token && req.cookies.username && (parseInt(req.cookies.positionid) == 3)) {
    urlencodedParser(req, res, async () => {
      const empid = parseInt(req.body.empid);
      pool.query(queries.getEmployeeById, [empid], (error, results) => {
        const noEmployeeFound = !results.rows.length;
        if (noEmployeeFound) {
          console.error('Error processing request:', "Сотрудника с таким id нет!");
          return res.status(400).json({ error: "Сотрудника с таким id нет!" });
        }
        else {
          pool.query(queries.removeEmployee, [empid], (error, results) => {
            if (error) {
              console.error('Error processing request:', error.message);
              return res.status(400).json({ error: error.message });
            }
            res.status(200).send("Employee remove successfully");
          });
        }
      });
    });
  } else {
    res.send("Пожалуйста, войдите в аккаунт HR, чтобы просмотреть эту страницу!");
  }
};

const add_test = (req, res) => {
  if (req.cookies && req.cookies.token && req.cookies.username && (parseInt(req.cookies.positionid) == 3)) {
    urlencodedParser(req, res, async () => {
      const { TypeTestName, TypeTestComp, TypeTestDesc, SoftTrue, Position } = req.body;
      console.log("softtrue", SoftTrue);
      if (SoftTrue != "true") {
        pool.query(
          queries.addTest,
          [TypeTestName, TypeTestComp, TypeTestDesc, "false", Position],
          (error, results) => {
            if (error) {
              console.error('Error processing request:', error.message);
              return res.status(400).json({ error: error.message });
            } 
            res.status(201).send("test inserted");
            console.log("test inserted");
          }
        );
      }
      else {
        pool.query(
          queries.addTest2,
          [TypeTestName, TypeTestComp, TypeTestDesc, SoftTrue],
          (error, results) => {
            if (error) {
              console.error('Error processing request:', error.message);
              return res.status(400).json({ error: error.message });
            } 
            res.status(201).send("test inserted");
            console.log("test inserted");
          }
        );
      }
    });
  } else {
    res.send("Пожалуйста, войдите в аккаунт HR, чтобы просмотреть эту страницу!");
  }
};

const addQuestion = (req, res) => {
  if (req.cookies && req.cookies.token && req.cookies.username && (parseInt(req.cookies.positionid) == 3)) {
    urlencodedParser(req, res, async () => {
      const { TypeTestId, Question, VarA, VarB, VarC, VarD, Answer } = req.body;
      pool.query(
        queries.addQuestion,
        [TypeTestId, Question, VarA, VarB, VarC, VarD, Answer],
        (error, results) => {
          if (error) {
            console.error('Error processing request:', error.message);
            return res.status(400).json({ error: error.message });
          } 
          res.status(201).send("question inserted");
          console.log("question inserted");
        }
      );
    });
  } else {
    res.send("Пожалуйста, войдите в аккаунт HR, чтобы просмотреть эту страницу!");
  }
};


const addFeedback = (req, res) => {
  const { empid, comment, grade } = req.body;
  if (req.cookies && req.cookies.token && req.cookies.username && (parseInt(req.cookies.empid) == (parseInt(empid)))) {
    pool.query(
      queries.addFeedback,
      [empid, comment, grade],
      (error, results) => {
        if (error) {
          console.error('Error processing request:', error.message);
          return res.status(400).json({ error: error.message });
        } 
        res.status(201).send("Feedback inserted");
        console.log("Feedback inserted");
      }
    );
  } else {
    res.send("Вы не можете добавить feedback!");
  }
};

const addInterview = (req, res) => {
  const { empid, hrid, comment } = req.body;
  if (req.cookies && req.cookies.token && req.cookies.username && (parseInt(req.cookies.positionid) == 3)) {
    pool.query(
      queries.insert_interview,
      [empid, hrid, comment],
      (error, results) => {
        if (error) {
          console.error('Error processing request:', error.message);
          return res.status(400).json({ error: error.message });
        } 
        res.status(201).send("Interview inserted");
        console.log("Interview inserted");
      }
    );
  } else {
    res.send("Вы не можете добавить interview!");
  }
};

const getInterview = (req, res) => {
  const id = parseInt(req.params.id);
  if (req.cookies && req.cookies.token && req.cookies.username && ((parseInt(req.cookies.positionid) == 3))) {
    pool.query(queries.get_interview, [id], (error, results) => {
      if (error) {
        console.error('Error processing request:', error.message);
        return res.status(400).json({ error: error.message });
      }
      res.status(200).json(results.rows);
    });
  } else {
    res.send("У вас нет доступа для просмотра этих данных!");
  }
};
module.exports = {
  get_all_test_results,
  get_last_test_results,
  employee_av_marks,
  position_av_marks,
  getEmployeeById,
  get_test_info,
  get_test_info_by_id,
  make_test,
  insert_result,
  recomendation,
  add_employee,
  removeEmployee,
  add_test,
  addQuestion,
  addFeedback,
  addInterview,
  getInterview
};