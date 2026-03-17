const nodemailer = require('nodemailer');
const path = require('path');

async function createTransporter() {
  const hbs = await import('nodemailer-express-handlebars'); // dynamic import

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });

  transporter.use(
    'compile',
    hbs.default({ // note the `.default` when importing ESM
      viewEngine: {
        partialsDir: path.resolve('./views/'),
        defaultLayout: false
      },
      viewPath: path.resolve('./views/'),
      extName: '.hbs'
    })
  );
  return transporter;
}

module.exports = createTransporter;
