const express = require('express')
const router = express.Router()

const AuthController = require('../controllers/AuthController')


router.post('/register', AuthController.register)

router.post('/login', AuthController.login)

router.post('/forgot', AuthController.forgotPassword)

router.post('/verify', AuthController.verifyResetCode)

router.post('/reset', AuthController.resetPassword)

module.exports = router