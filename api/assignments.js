const { Router } = require('express')

const router = Router()

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

router.post('/:id/submissions', (req, res, next) => {
    try {
        console.log(`  -- Create a new submission for a specific assignment: ${req.params.id}`)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.get('/:id/submissions', (req, res, next) => {
    try {
        console.log(`  -- Fetch a list of all submissions for a specific assignment: ${req.params.id}`)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

module.exports = router