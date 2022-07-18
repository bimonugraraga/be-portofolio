const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')

router.post('/register', authController.registerEmail)
router.post('/login', authController.login)
router.post('/verify', authController.verifOTP)

module.exports = router