require('dotenv').config()

const { connectToDb, getDbReference, closeDbConnection } = require('./lib/mongo')
const usersToInsert = require('./data/users.json')

connectToDb(async function () {
    const db = getDbReference()
    const collection = db.collection('users')
    const result = await collection.insertMany(usersToInsert)
    console.log(result)
    console.log('  -- Inserted Users')

    closeDbConnection(function () {
        console.log("== DB connection closed")
    })
}, false)