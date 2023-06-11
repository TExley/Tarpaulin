const { getDbReference } = require("../lib/mongo")
const { ObjectId } = require('mongodb')

async function getAssignmentById(id) {
    const db = getDbReference()
    const collection = db.collection("assignments")

    if (!ObjectId.isValid(id)) {
        return null
    } else {
        const results = await collection.find({ 
            _id: new ObjectId(id) 
        }).toArray()
        
        return results[0]
    }
}
exports.getAssignmentById = getAssignmentById

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