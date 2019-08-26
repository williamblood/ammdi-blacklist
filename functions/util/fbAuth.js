const { admin, db } = require("./admin");

// Middleware
module.exports = (request, response, next) => {
  let idToken;
  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = request.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("Token not found");
    return response.status(403).json({ error: "Unauthorized" });
  }

  // Verifies token is active and legitimate; also updates user data
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      // decodedToken holds data inside the idToken (the user data)
      request.user = decodedToken; // Adds data from the decoded token to the user
      console.log(decodedToken);
      // Second request required! User's handle is stored in collections, not Firebase's auth system
      return db
        .collection("users")
        .where("userId", "==", request.user.uid)
        .limit(1) // Limits results to 1 document
        .get();
    })
    .then(querySnapshot => {
      // Contains only 1 document
      // To access document from query, .docs is required
      request.user.handle = querySnapshot.docs[0].data().handle;
      return next(); // next() allows request to continue
    })
    .catch(err => {
      console.error("There was an error verifying your token", err);
      return response.status(403).json(err);
    });
};
