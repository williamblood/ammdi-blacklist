// for access to database, uses admin SDK
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

module.exports = { admin, db };
