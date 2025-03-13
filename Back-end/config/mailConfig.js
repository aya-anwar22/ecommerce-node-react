const nodemailer = require('nodemailer');
// setting SMTP
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE === 'true',
    auth:{
        user: process.env.ADMIN_EMAIL,
        pass: process.env.EMAIL_PASS
    },

    tls:{
        rejectUnauthorized: false
    }
});
module.exports = transporter;