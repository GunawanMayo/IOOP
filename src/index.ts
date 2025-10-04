import express , { Express } from "express";
import cors from "cors";
import mysql, { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
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

  type Todo = {
    id : number;
    title : string;
    description : string;
    createdAt? : Date;
    updatedAt? : Date;
  };

  app.get("/api/todos", async(req,res) => {
    try {
      const sql = "select * FROM todos";
      const [rows]= await connection.execute<Todo[] & RowDataPacket[]>(sql);
      res.json(rows);
    } catch (err){
      if (err instanceof Error){
        console.log(`execute error: ${err} `);
        res.status(500).send();
      }
    }
  });

  app.get("/api/todos/:id", async(req,res) => {
    try {
      const id = parseInt(req.params.id);
      const sql = `select * FROM todos WHERE id=${id}`;
      const [rows] = await connection.execute<Todo[]& RowDataPacket[]>(sql);
      res.json(rows[0]);
    } catch (err) {
      if (err instanceof Error){
        console.log(`execute error: ${err}`);
        res.status(500).send();
      }
    }
  });

  app.post("/api/todos", async(req,res) => {
    try{
    const todo = req.body
    const sql = `INSERT INTO todos(title, description) VALUES ("${todo.title}", "${todo.description}")`;
    const [result] = await connection.execute<ResultSetHeader>(sql);
    res.status(201).json(result.insertId);
    }catch (err) {
      if (err instanceof Error){
        console.log(`execute error: ${err}`);
        res.status(500).send();
      }
    }
  });

  app.put("/api/todos/:id", async (req, res) => {
    try{
      const id = parseInt(req.params.id);
      const todo = req.body;
      const sql = `UPDATE todos SET title= "${todo.title}", description="${todo.description}" WHERE id= "${id}"`;
      await connection.execute<ResultSetHeader>(sql);
      res.status(200).send();
    }catch (err) {
      if (err instanceof Error){
        console.log(`execute error: ${err}`);
        res.status(500).send();
      }
    }
  });

  app.delete("/api/todos/:id", async(req, res) => {
    try{
      const id = parseInt(req.params.id);
      const sql = `DELETE FROM todos WHERE id=${id}`;
      await connection.execute<ResultSetHeader>(sql);
      res.status(204).send();
    } catch(err) {
      if (err instanceof Error){
        console.log(`execute error: ${err}`);
        res.status(500).send();
      }
    }
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