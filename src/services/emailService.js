const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

exports.sendConfirmationEmail = (email, username) => {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Account Confirmation',
        text: `Hello ${username},\n\nThank you for registering. Please confirm your email address by clicking the link below:\n\nhttp://yourdomain.com/confirm?email=${email}\n\nThank you!`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
};
