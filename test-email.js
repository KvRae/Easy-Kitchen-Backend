require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log('Testing email configuration...');
    console.log('GMAIL_USER:', process.env.GMAIL_USER ? 'Set' : 'NOT SET');
    console.log('GMAIL_PASSWORD:', process.env.GMAIL_PASSWORD ? 'Set (hidden)' : 'NOT SET');

    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
        console.error('\n❌ Error: Gmail credentials not configured');
        console.log('\nPlease ensure your .env file contains:');
        console.log('GMAIL_USER=your-email@gmail.com');
        console.log('GMAIL_PASSWORD=your-app-password');
        console.log('\nNote: Use an App Password if you have 2FA enabled on Gmail');
        console.log('Generate one at: https://myaccount.google.com/apppasswords');
        process.exit(1);
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
        tls: {
            rejectUnauthorized: false
        }
    });

    console.log('\n⏳ Attempting to send test email...');

    try {
        const info = await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER, // Send to yourself
            subject: 'Easy Kitchen - Email Test',
            html: '<h2>Success!</h2><p>Your email configuration is working correctly.</p>'
        });

        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
        console.log('\n✨ Your forgot password feature should now work properly!');
    } catch (error) {
        console.error('\n❌ Failed to send email');
        console.error('Error:', error.message);

        if (error.code === 'EAUTH') {
            console.log('\n💡 Authentication failed. Common causes:');
            console.log('  1. Wrong email or password');
            console.log('  2. Using regular password instead of App Password (if 2FA is enabled)');
            console.log('  3. "Less secure app access" is disabled (for non-2FA accounts)');
        } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNECTION') {
            console.log('\n💡 Connection timeout. Common causes:');
            console.log('  1. Firewall blocking SMTP port 587');
            console.log('  2. Network restrictions on your hosting provider');
            console.log('  3. Try using port 465 with secure: true instead');
        }
    }
}

testEmail();
