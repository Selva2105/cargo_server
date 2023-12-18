const nodemailer = require('nodemailer');

const sendEmail = async (option) => {

    // 1. Create a transportor (A service to send email)
    var transport = nodemailer.createTransport({
        host:  process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

    // 2. Email options 

    const emailOptions = {
        from: 'CarGo support@cargo.com',
        to: option.email,
        subject: option.subject,
        text: option.message
    }

    // 3. Send email 
    await transport.sendMail(emailOptions);

}

module.exports = sendEmail;