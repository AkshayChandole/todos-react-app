import express from "express";
require("dotenv").config();

import { MongoClient, ObjectId } from "mongodb";

//const express = require("express");
//const uuid = require("uuid");

/*
let fakeTodos = [
  [
    {
      _id: "64286c26c924d20090bb7b98",
      text: "Learn React JS",
      isCompleted: true,
    },
    {
      _id: "642874163d1a4433e22e50f0",
      text: "Learn JS",
      isCompleted: true,
    },
    {
      _id: "642875143e5ae2e8b0f5b769",
      text: "Learn HTML",
      isCompleted: false,
    },
    {
      _id: "642875233e5ae2e8b0f5b76a",
      text: "Learn CSS",
      isCompleted: false,
    },
  ],
];
*/

const start = async () => {
  const client = await MongoClient.connect(process.env.MangoDB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db("todos-react-database");

  const app = express();
  app.use(express.json());

  app.get("/todos", async (req, res) => {
    const todos = await db.collection("todos").find({}).toArray();
    res.json(todos);
    //res.json(fakeTodos);
  });

  app.post("/todos", async (req, res) => {
    const newTodoText = req.body.newTodoText;
    const newTodo = {
      text: newTodoText,
      isCompleted: false,
    };
    const result = await db.collection("todos").insertOne(newTodo);

    res.json({
      ...newTodo,
      _id: result.insertedId,
    });

    // fakeTodos.push(newTodo);
    // res.json(newTodo);
  });

  app.delete("/todos/:todoId", async (req, res) => {
    const todoId = req.params.todoId;
    await db.collection("todos").deleteOne({ _id: new ObjectId(todoId) });
    const todos = await db.collection("todos").find({}).toArray();

    res.json(todos);
    //fakeTodos = fakeTodos.filter((todo) => todo._id !== todoId);
    // res.json(fakeTodos);
  });

  app.put("/todos/:todoId", async (req, res) => {
    const todoId = req.params.todoId;
    await db.collection("todos").updateOne(
      { _id: new ObjectId(todoId) },
      {
        $set: { isCompleted: true },
      }
    );
    const todos = await db.collection("todos").find({}).toArray();
    res.json(todos);
    // fakeTodos.find((todo) => todo._id === todoId).isCompleted = true;
    // res.json(fakeTodos);
  });

  app.listen(process.env.PORT, () => {
    console.log("Server is listening on port 8080");
  });
};

start();
