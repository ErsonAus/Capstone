const nodemailer = require('nodemailer')
require('dotenv').config()
console.log('EMAIL_USER:', process.env.EMAIL_PASS, process.env.EMAIL_USER)
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

module.exports = { transporter }