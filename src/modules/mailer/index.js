const nodemailer = require('nodemailer');

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

const sendMail = async ({to, subject, html, text}) => {
    return await transporter.sendMail({
        from: process.env.APP_NAME,
        to: to,
        subject: subject,
        text: text,
        html: html,
    });
};

const sendMailVerify = async (email, link) => {
    const options = {
        to: email,
        subject: "Account Verification Link",
        text: `Hello ,\nPlease verify your account by clicking this link: \n${link}\nThank you!`,
        html: `
                <p>Hello ,</p>
                <p>Please verify your account by clicking this link: \n <a href='${link}' target='_blank'>Verify link</a></p>
                <p>Thank you!</p>
        `
    }
    return await sendMail(options);
}

module.exports = {
    sendMail,
    sendMailVerify
}
