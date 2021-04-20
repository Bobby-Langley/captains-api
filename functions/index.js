const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { getUsers, getSingleUser, postUser, updateUser, deleteUser} = require("./src/users/index")

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/users", getUsers);
app.post("/users", postUser);
app.patch("/users/:userId", updateUser);
app.delete("/users/:userId", deleteUser);


app.get("/user/:userId", getSingleUser);


exports.app = functions.https.onRequest(app);