const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: `"IOCL Attendance Admin" <${process.env.SMTP_USER}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
    }
};

module.exports = sendEmail;