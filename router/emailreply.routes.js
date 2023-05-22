const express = require("express")
const emailRouter = express.Router()
const {sendEmailController} = require("../controllers/email.controller")

//@route /email/sendemails
//@desc send emails
emailRouter.get('/sendemails',sendEmailController)

module.exports = emailRouter