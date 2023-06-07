const { Router } = require('express')

const router = Router()

router.post('/', (req, res, next) => {
    try {
        console.log("  -- Create a new user")
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.post('/login', (req, res, next) => {
    try {
        console.log("  -- Login a user")
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

router.get('/:id', (req, res, next) => {
    try {
        console.log(`  -- Fetch data about a specific user: ${req.params.id}`)
        res.status(200).send()
    } catch (err) {
        next(err)
    }
})

module.exports = router