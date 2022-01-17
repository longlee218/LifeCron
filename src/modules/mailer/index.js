const nodemailer = require('nodemailer');

const prefixAPI = process.env.API_PREFIX || "/api/v1/";
const port = process.env.PORT || 3000;

const transporter = nodemailer.createTransport({
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

const sendMail = async ({ to, subject, html, text }) => {
    return await transporter.sendMail({
        from: process.env.APP_NAME,
        to: to,
        subject: subject,
        text: text,
        html: html,
    });
};

const sendMailVerify = async (req, email, accessToken) => {
    const host = req.hostname;
    const link = "http://" + host + ":" + port + prefixAPI + "verify" + "/" + email + "/" + accessToken;
    const options = {
        to: email,
        subject: "Account Verification Link Emitter",
        text: `Hello ,\nPlease verify your account by clicking this link: \n${link}\nThank you!`,
        html: `
                <p>Hello ,</p>
                <p>Please verify your account by clicking this link: \n <a href='${link}' target='_blank'>Verify link</a></p>
                <p>Thank you!</p>
        `
    }
    await sendMail(options);
    return `System sent verify e-mail to address: ${email} and will expire after 1 hour. If you are not received, please click this button below.`
}

module.exports = {
    sendMail,
    sendMailVerify
}
