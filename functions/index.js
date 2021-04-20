const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(bodyParser.json());
app.use(cors());

const { getUsers, getSingleUser, postUser, updateUser, deleteUser} = require("./src/users/index")

app.get("/users", getUsers);
app.get("/user/:userId", getSingleUser);

app.post("/users", postUser);
app.patch("/users/:userId", updateUser);
app.delete("/users/:userId", deleteUser);


exports.app = functions.https.onRequest(app);
