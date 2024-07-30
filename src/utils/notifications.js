const sgMail = require('../config/sendGridConfig');
// const twilioClient = require('../config/twilioConfig');
const User = require('../models/User');

// Send an email notification
const sendEmailNotification = async (to, subject, text) => {
    const msg = {
        to,
        from: 'your-email@example.com', // Use your verified SendGrid sender
        subject,
        text
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Send an SMS notification
const sendSmsNotification = async (to, body) => {
    try {
        await twilioClient.messages.create({
            body,
            from: process.env.TWILIO_PHONE_NUMBER,
            to
        });
        console.log('SMS sent successfully');
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
};

// Send notifications based on user preferences
const notifyUser = async (userId, subject, text, smsBody) => {
    try {
        const user = await User.findById(userId);

        if (user.notificationPreferences.email) {
            await sendEmailNotification(user.email, subject, text);
        }

        if (user.notificationPreferences.sms && user.phoneNumber) {
            await sendSmsNotification(user.phoneNumber, smsBody);
        }
    } catch (error) {
        console.error('Error notifying user:', error);
    }
};

module.exports = { notifyUser };
