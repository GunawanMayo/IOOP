import express , { Express } from "express";
import cors from "cors";
import mysql, { Connection } from "mysql2/promise";
import * as dotenv from "dotenv";

// const express = require("express");
// const cors = require("cors");
// const mysql2 = require("mysql2");

async function main() {
  dotenv.config();
  const{PORT, MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASS, MYSQL_DB} = process.env;
  const app: Express =  express();

  app.listen(parseInt(PORT as string),function() {
    console.log(("Node.js is listening to PORT: " + PORT) as string);
  });

  app.disable("x-powered-by")
  app.use(cors()).use(express.json());

  const connection : Connection =  await mysql.createConnection({
  host: MYSQL_HOST,
  port: parseInt(MYSQL_PORT as string),
  user: MYSQL_USER,
  password: MYSQL_PASS,
  database: MYSQL_DB,
  });

  // const sql = "select * FROM todos";
  // const result = await connection.execute(sql);

  // console.log(result);

  app.get("/api/todos", async(req,res) => {
    const sql = "select * FROM todos";
    const [rows]= await connection.execute(sql);
    res.json(rows);
  });

//   app.get('/', (req, res) => {
//   const sql = `
//     select 
//       id, 
//       title, 
//       description 
//     from 
//       todos
//   `
//   connection.query(sql, (error, result) => {
//     if (err) {
//       console.log(err);
//       res.status(500).json();
//       return;
//     }
//     res.json(result);
//   });
// });

// app.get("/api/todos/:id", (req, res) => {
//   const id = req.params.id;
//   const sql = `
//     SELECT
//       id,
//       title,
//       description
//     FROM
//       todos
//     WHERE
//       id = ${id};
//   `;

//   connection.query(sql, (err, result) => {
//     if (err) {
//       console.log(err);
//       res.status(500).json();
//       return;
//     }
//     if (result.length === 0) {
//       res.status(404).json();
//       return;
//     }
//     res.status(200).json(result[0]);
//   });
// })

// app.post("/api/todos", (req, res) => {
//   const todo = req.body;

//   const sql = `
//     insert into todos (title,description)
//     values ("${todo.title}", "${todo.description}")
//   `

//   connection.query(sql, (error, result) => {
//     if (err) {
//       console.log(err);
//       res.status(500).json();
//       return;
//     }
//     res.status(201).json(result.insertId);
//   })
// });

}

main()