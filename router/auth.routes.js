const express = require('express')
const authRouter = express.Router();
const {authGenerateURLController, authCodeController} = require('../controllers/auth.controller')



// @route GET /auth/login
// @desc Generate Auth URL
authRouter.get('/login', authGenerateURLController )

// @route GET /auth/code
// @desc Receive callback from Auth URL to create token
authRouter.get('/code',authCodeController)

module.exports = authRouter