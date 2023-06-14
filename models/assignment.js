const { extractValidFields } = require("../lib/validation");
const { getDbReference } = require("../lib/mongo");
const { ObjectId } = require("mongodb");

const AssignmentSchema = {
  title: { require: true },
  points: { require: true },
  due_date: { require: true },
  course_id: { require: false },
  submissions: { require: false },
};
exports.AssignmentSchema = AssignmentSchema;

async function insertNewAssignment(Assignment) {
    Assignment = extractValidFields(Assignment, AssignmentSchema);
  const db = getDbReference();
  const collection = db.collection("Assignments");
  const result = await collection.insertOne(Assignment);
  return result.insertedId;
}
exports.insertNewAssignment = insertNewAssignment;

async function getAssignmentsPage(page) {
  const db = getDbReference();
  const collection = db.collection("Assignments");
  const count = await collection.countDocuments();

  /*
   * Compute last page number and make sure page is within allowed bounds.
   * Compute offset into collection.
   */
  const pageSize = 10;
  const lastPage = Math.ceil(count / pageSize);
  page = page > lastPage ? lastPage : page;
  page = page < 1 ? 1 : page;
  const offset = (page - 1) * pageSize;

  const results = await collection
    .find({})
    .sort({ _id: 1 })
    .skip(offset)
    .limit(pageSize)
    .toArray();

  return {
    Assignments: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count,
  };
}
exports.getAssignmentsPage = getAssignmentsPage;

async function getAssignmentById(id) {
  const db = getDbReference();
  const collection = db.collection("Assignments");

  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await collection
      .find({
        _id: new ObjectId(id),
      })
      .toArray();
    return results[0];
  }
}
exports.getAssignmentById = getAssignmentById;

async function updateAssignmentById(id, Assignment) {
  const db = getDbReference();
  const collection = db.collection("Assignments");
  const AssignmentInfo = {
    subject: Assignment.subject,
    number: Assignment.number,
    title: Assignment.title,
    term: Assignment.term,
    instructorId: Assignment.instructorId,
  };

  const result = await collection.replaceOne(
    { _id: new ObjectId(id) },
    AssignmentInfo
  );



  return result.matchedCount > 0;
}
exports.updateAssignmentById = updateAssignmentById;



async function deleteAssignmentById(id) {
  const db = getDbReference();
  const collection = db.collection("Assignments");
  const result = await collection.deleteOne({
    _id: new ObjectId(id),
  });
  console.log(" -- result: ", result);
  return result.deletedCount > 0;
}
exports.deleteAssignmentById = deleteAssignmentById;

async function addStudentToAssignment(AssignmentId, studentIds) {
  const db = getDbReference();
  const collection = db.collection("Assignments");

  const result = await collection.updateOne(
    { _id: new ObjectId(AssignmentId) },
    { $push: { students: { $each: studentIds } } }
  );

  return result.matchedCount > 0;
}
exports.addStudentToAssignment = addStudentToAssignment;

async function removeStudentFromAssignment(AssignmentId, studentIds) {
  const db = getDbReference();
  const collection = db.collection("Assignments");
  
  const result = await collection.updateOne(
    { _id: new ObjectId(AssignmentId) },
    { $pull: { students: { $in: studentIds } } }
  );

  return result.matchedCount > 0;
}
exports.removeStudentFromAssignment = removeStudentFromAssignment;

async function getEnrolledStudentsInfoFromAssignmentById(studentIds) {
  const db = getDbReference();
  const collection = db.collection("users");
  const objectIds = studentIds.map((id) => new ObjectId(id));

  const students = await collection.find({ _id: { $in: objectIds } }).toArray();
  return students;
}
exports.getEnrolledStudentsInfoFromAssignmentById =
  getEnrolledStudentsInfoFromAssignmentById;

async function updateAssignmentSubmissionsById(id, submissions) {
    const db = getDbReference()
    const collection = db.collection("assignments")

    const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { submissions: submissions } }
    )

    return result.matchedCount > 0
}
exports.updateAssignmentSubmissionsById = updateAssignmentSubmissionsById
