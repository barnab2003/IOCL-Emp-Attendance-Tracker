// server/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create a test account (Ethereal automatically generates fake credentials for testing)
    const testAccount = await nodemailer.createTestAccount();

    // 2. Create a transporter using the fake SMTP details
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user, // Generated test user
            pass: testAccount.pass, // Generated test password
        },
    });

    // 3. Define the email options
    const mailOptions = {
        from: '"IOCL HR Portal" <noreply@iocl.com>',
        to: options.email,
        subject: options.subject,
        html: options.message, // Accepts HTML to make the email look nice
    };

    // 4. Send the email
    const info = await transporter.sendMail(mailOptions);

    // 5. Log the URL so you can view the fake email in your browser!
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

module.exports = sendEmail;