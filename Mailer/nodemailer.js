const nodemailer = require('nodemailer');
const path = require('path');


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



 transporter.use(
  'compile',
  hbs.default({
    viewEngine: {
      partialsDir: path.join(__dirname, '../views'), // use __dirname
      defaultLayout: false
    },
    viewPath: path.join(__dirname, '../views'), // use __dirname
    extName: '.hbs'
  })
);

  
  return transporter;
}

module.exports = createTransporter;
