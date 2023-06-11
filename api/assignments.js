const { Router } = require('express')
const { validateAgainstSchema } = require("../lib/validation")
const { getAssignmentById, updateAssignmentSubmissionsById } = require("../models/assignment")
const fs = require("node:fs/promises")
const {
    SubmissionSchema,
    insertNewSubmission,
    getSubmissionById,
    getSubmissionsById
} = require('../models/submission')


const router = Router()

const fileType = { 'text/csv': 'csv' }
const multer = require('multer')
const crypto = require('node:crypto')
const { Console } = require('node:console')
const upload = multer({
    storage: multer.diskStorage({
        destination: `${__dirname}/../uploads`,
        filename: (req, file, callback) => {
            const filename = crypto.pseudoRandomBytes(16).toString('hex')
            const extension = fileType[file.mimetype]
            callback(null, `${filename}.${extension}`)
        }
    }),
    fileFilter: (req, file, callback) => {
        callback(null, !!fileType[file.mimetype])
    }
})

router.post('/', (req, res, next) => {
    try {
        console.log("  -- Create a new assignment")
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.get('/:id', (req, res, next) => {
    try {
        console.log(`  -- Fetch data about a specific assignment: ${req.params.id}`)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.patch('/:id', (req, res, next) => {
    try {
        console.log(`  -- Update data about a specific assignment: ${req.params.id}`)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', (req, res, next) => {
    try {
        console.log(`  -- Remove a specific assignment: ${req.params.id}`)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.post('/:id/submissions', upload.single('file'), async (req, res, next) => {
    try {
        console.log(`  -- Create a new submission for a specific assignment: ${req.params.id}`)
        const assignment = await getAssignmentById(req.params.id)
        if (assignment) {
            if (req.file && validateAgainstSchema(req.body, SubmissionSchema)) {
                const id = await insertNewSubmission(req.params.id, req.body, req.file)
                if (id) {
                    await fs.unlink(req.file.path)
                    submissions = assignment.submissions
                    submissions.push(id)
                    await updateAssignmentSubmissionsById(req.params.id, submissions)

                    res.status(201).send({
                        id: id
                    })
                } else {
                    next()
                }
            } else {
                res.status(400).send({
                    err: "The request body was either not present or did not contain a valid Submission object."
                })
            }
        } else {
            next()
        }
    } catch (err) {
        next(err)
    }
})

router.get('/:id/submissions', async (req, res, next) => {
    try {
        console.log(`  -- Fetch a list of all submissions for a specific assignment: ${req.params.id}`)
        const assignment = await getAssignmentById(req.params.id)
        if (assignment) {
            let page = parseInt(req.query.page) || 1
            let count = assignment.submissions.length
            const pageSize = 5
            let lastPage = Math.ceil(count / pageSize)
            page = page > lastPage ? lastPage : page
            page = page < 1 ? 1 : page
            const offset = (page - 1) * pageSize

            let submissions = []

            let i = offset
            let i_end = Math.min(offset + pageSize, count)

            if (req.query.studentId) {
                i = 0
                i_end = count
            }
            let offset_count = 0

            for (i; i < i_end; i++) {  
                submission = await getSubmissionById(assignment.submissions[i])

                // Will ignore when a submission id is nonexistant
                if (submission) {
                    if (req.query.studentId) {
                        if (submission.metadata.studentId == req.query.studentId) {
                            offset_count++
                            if (offset_count > offset && submissions.length <= pageSize) {
                                submissions.push({
                                    assignmentId: submission.metadata.assignmentId,
                                    studentId: submission.metadata.studentId,
                                    timestamp: submission.metadata.timestamp,
                                    grade: submission.metadata.grade,
                                    url: `media/submissions/${submission._id}`
                                })
                            }
                        } else {
                            count--
                        }
                    } else {
                        submissions.push({
                            assignmentId: submission.metadata.assignmentId,
                            studentId: submission.metadata.studentId,
                            timestamp: submission.metadata.timestamp,
                            grade: submission.metadata.grade,
                            url: `media/submissions/${submission._id}`
                        })
                    }
                } else if (req.query.studentId) {
                    count--
                }
            }

            if (req.query.studentId) {
                lastPage = Math.ceil(count / pageSize)
                page = page > lastPage ? lastPage : page
            }
        
            res.status(200).send({
                submissions: submissions,
                page: page,
                totalPages: lastPage,
                pageSize: pageSize,
                count: count
            })
        } else {
            next()
        }
    } catch (err) {
        next(err)
    }
})

module.exports = router