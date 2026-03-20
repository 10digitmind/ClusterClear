const nodemailer = require('nodemailer');
const path = require('path');
const viewsPath = path.join(__dirname, '../views');

async function createTransporter() {
  const hbs = await import('nodemailer-express-handlebars'); // dynamic import

  const transporter = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER ,
      pass: process.env.SMTP_PASSWORD
      
    }
  });

  
  return transporter;
}

module.exports = createTransporter;
