const { db } = require("../util/admin");

exports.getAllPosts = (request, response) => {
  db.collection("posts")
    .orderBy("createdAt", "desc")
    .get()
    .then(querySnapshot => {
      let posts = [];
      querySnapshot.forEach(doc => {
        posts.push({
          postId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount
        });
      });
      return response.json(posts);
    })
    .catch(err => {
      console.error(err);
      response.status(500).json({ error: err.code });
    });
};

exports.postOnce = (request, response) => {
  // trim() used to prevent space characters
  if (request.body.body.trim() === "") {
    return response.status(400).json({ body: "Body must not be empty" });
  }
  const newPost = {
    body: request.body.body, //req.body is the body of the request not the body of the post, thus body.body
    userHandle: request.user.handle, // Changed from req.body.userHandle due to FBAuth
    createdAt: new Date().toISOString()
  };

  // newPost must persist in the db now
  db.collection("posts")
    .add(newPost) //.add() adds newPost as json object to db
    .then(doc => {
      return response.json({ message: `Document ${doc.id} created.` });
    })
    .catch(err => {
      response.status(500).json({
        error: "Something went wrong. Internal Server Error: 500."
      });
      console.error(err);
    });
};
