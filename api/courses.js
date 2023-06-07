const { Router } = require('express')

const router = Router()

router.post('/', (req, res, next) => {
    try {
        console.log("  -- Create a new course")
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.get('/', (req, res, next) => {
    try {
        console.log('  -- Fetch the list of all courses')
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.get('/:id', (req, res, next) => {
    try {
        console.log(`  -- Fetch data about a specific course: ${req.params.id}`)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.patch('/:id', (req, res, next) => {
    try {
        console.log(`  -- Update data about a specific course: ${req.params.id}`)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.delete('/:id', (req, res, next) => {
    try {
        console.log(`  -- Remove a specific course: ${req.params.id}`)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.post('/:id/students', (req, res, next) => {
    try {
        console.log(`  -- Update enrollment for a specific course: ${req.params.id}`)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.get('/:id/students', (req, res, next) => {
    try {
        console.log(`  -- Fetch a list of the students enrolled in a specific course: ${req.params.id}`)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.get('/:id/roster', (req, res, next) => {
    try {
        console.log(`  -- Fetch a csv file containing a list of student enrollment for a specific course: ${req.params.id}`)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.get('/:id/assignments', (req, res, next) => {
    try {
        console.log(`  -- Fetch a list of assignments for a specific course: ${req.params.id}`)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

module.exports = router