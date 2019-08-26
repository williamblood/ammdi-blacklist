const { admin, db } = require("../util/admin");

const firebaseConfig = require("../util/firebaseConfig");

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

const { validateSignupData, validateLoginData } = require("../util/validators");

exports.signup = (request, response) => {
  const newUser = {
    email: request.body.email,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword,
    handle: request.body.handle
  };
  // Login errors enter as objects here
  const { valid, errors } = validateSignupData(newUser);
  if (!valid) return response.status(400).json(errors);

  const noImage = "no-img.png";

  // Creates document when user signs up
  let token, userId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return response
          .status(400)
          .json({ handle: "Handle taken. Choose another" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(doc => {
      userId = doc.user.uid; // .uid and .user provided by Firebase Admin SDK
      return doc.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${
          firebaseConfig.storageBucket
        }/o/${noImage}?alt=media`,
        userId
      };
      // Persists credentials into a document inside collections
      return db
        .doc(`/users/${newUser.handle}`)
        .set(userCredentials)
        .then(WriteResult => {
          return response.status(201).json({ token });
        });
    })
    // TODO: finish adding user signup errors
    .catch(err => {
      console.error(err);
      switch (err.code) {
        case "auth/email-already-in-use":
          return response.status(400).json({ email: "Email already in use." });
        case "auth/weak-password":
          return response.status(400).json({ password: "Weak password." });
        default:
          return response.status(500).json({ error: err.code });
      }
    });
};

exports.login = (request, response) => {
  const user = {
    email: request.body.email,
    password: request.body.password
  };

  const { valid, errors } = validateLoginData(user);
  if (!valid) return response.status(400).json(errors);

  // Logs in user if no errors
  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken(); // retrieves users' access token from Firebase UserCredentials
    })
    .then(token => {
      return response.json({ token }); // users' token
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/wrong-password") {
        return response
          .status(403)
          .json({ general: "Incorrect credentials, please try again." });
      } else return response.status(500).json({ error: err.code });
    });
};

// Busboy-dependent user upload route
exports.uploadImage = (request, response) => {
  // Imported packages
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: request.headers });

  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname);
    console.log(filename);
    console.log(mimetype);
    // my.image.png = filename
    const imageExtension = filename.split(".")[filename.split(".").length - 1];

    // 1233190481938.png
    imageFileName = `${Math.round(
      Math.random() * 100000000000
    )}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    // Creates a file using the File Path Library
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
          firebaseConfig.storageBucket
        }/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${request.user.handle}`).update({ imageUrl });
      })
      .then(() => {
        return response.json({ message: "Image uploaded successfully" });
      })
      .catch(err => {
        console.error(err);
        return response.json({ error: err.code });
      });
  });
  busboy.end(request.rawBody);
};
