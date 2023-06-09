require("dotenv").config();

const {
  connectToDb,
  getDbReference,
  closeDbConnection,
} = require("./lib/mongo");
const usersToInsert = require("./data/users.json");
const coursesToInsert = require("./data/courses.json");
const assignmentsToInsert = require("./data/assignments.json");

connectToDb(async function () {
  const db = getDbReference();
  const collection = db.collection("users");
  const result = await collection.insertMany(usersToInsert);
  console.log(result);
  console.log("  -- Inserted Users");

  //insert courses to db
  await db.collection("courses").insertMany(coursesToInsert);
  // insert assignment to db
  await db.collection("assignments").insertMany(assignmentsToInsert);

  closeDbConnection(function () {
    console.log("== DB connection closed");
  });
}, false);
