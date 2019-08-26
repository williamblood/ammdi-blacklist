const functions = require("firebase-functions");

const express = require("express");
const app = express();

const FBAuth = require("./util/fbAuth");

// Imports post handler functions
const { getAllPosts, postOnce } = require("./handlers/posts");
const { signup, login, uploadImage, getAuthUser } = require("./handlers/users");

// exports.getPosts = functions.https.onRequest((req, res) => {}); <<< UNOPTIMIZED
// use app.get() function from Express instead

// Posts route
app.get("/posts", getAllPosts);
app.post("/user-post", FBAuth, postOnce); // Create documents (as object)

// user routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.get("/user", FBAuth, getAuthUser);

exports.api = functions.https.onRequest(app); //creates /api/ path https://asmonmademedoit.com/api/
