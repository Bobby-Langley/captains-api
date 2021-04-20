const admin = require("firebase-admin");
const serviceAccount = require("../../credentials.json");

let db;

function dbAuth() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    db = admin.firestore();
  }
}

exports.getUsers = (req, res) => {
  dbAuth();
  db.collection("users")
    .get()
    .then((collection) => {
      const usersList = collection.docs.map((doc) => {
        let user = doc.data();
        user.id = doc.id;
        return user;
      });
      res.status(200).json(usersList);
    })
    .catch((err) => res.status(500).send("GET USERS FAILED: " + err));
};

exports.postUser = (req, res) => {
  dbAuth();
  let newUser = req.body;
  let now = admin.firestore.FieldValue.serverTimestamp();
  newUser.updated = now;
  newUser.created = now;

  db.collection("users")
    .add(newUser)
    .then(() => {
      this.getUsers(req, res);
    })
    .catch((err) => res.status(500).send("POST FAILED" + err));
};

exports.updateUser = (req, res) => {
  if (!req.body || !req.params.userId) {
    res.status(400).send("Invalid request");
  }
  dbAuth();
  db.collection("users")
    .doc(req.params.userId)
    .update(req.body)
    .then(() => this.getSingleUser(req, res))
    .catch((err) => res.status(500).send("UPDATE FAILED: " + err));
};

exports.deleteUser = (req, res) => {
  if (!req.params.userId) {
    res.status(400).send("Invalid request, no userId");
  }
  dbAuth();
  db.collection("users")
    .doc(req.params.userId)
    .delete()
    .then(() => {
      res.status(200).send("Success");
    })
    .catch((err) => res.status(500).send("DELETE FAILED: " + err));
};

exports.getSingleUser = (req, res) => {
  if (!req.params.userId) {
    res.status(400).send("Invalid Request, no userId");
  }
  dbAuth();
  db.collection("users")
    .doc(req.params.userId)
    .get()
    .then((doc) => {
      let user = doc.data();
      user.id = doc.id;
      res.status(200).json({
        status: "success",
        data: user,
        message: "User retrieved",
        statusCode: 200,
      });
    })
    .catch((err) => res.status(500).send("get user failed:", err));
};
