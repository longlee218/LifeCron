const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
    pool: true,
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});
