
const createTransporter = require("../Mailer/nodemailer");
const resetEmailPassword = require("../htmlDesigns/resetEmailPassword");
const verifyEmail = require("../htmlDesigns/verfiyEmail");
const waitList = require("../htmlDesigns/waitlist");
const welcome = require("../htmlDesigns/welcome");


async function sendVerificationEmail(userEmail, userName, token) {
  const transporter = await createTransporter();
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `ClusterClear <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Verify Your Email",
    html:verifyEmail(userName,verificationUrl,new Date().getFullYear()), // template name without extensio
  
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}


async function sendPasswordResetEmail(userEmail, userName, resetUrl) {
  const transporter = await createTransporter();

  const mailOptions = {
   from: `ClusterClear <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Password reset  request",
    html:resetEmailPassword(userName, resetUrl,new Date().getFullYear()), // template name without extension
  
  };
  
  try {
    await transporter.sendMail(mailOptions);
    
  } catch (err) {
    console.error("Error sending email:", err);
  }
}




async function welcomeEmail(userEmail, name, dashboardUrl) {
  const transporter = await createTransporter();

  const mailOptions = {
    from: `ClusterClear <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Welcome to ClusterClear!",
    html: welcome(name,dashboardUrl,new Date().getFullYear()), // template name without extension
  
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${userEmail}`);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}


// async function changePasswordEmail(userEmail, name, resetUrl,changedAt) {
//   const transporter = await createTransporter();

//   const mailOptions = {
//    from: `ClusterClear <${process.env.EMAIL_USER}>`,
//     to: userEmail,
//     subject: "Password Changed Successfully",
//     html: passwordChange( name, resetUrl,changedAt,new Date().getFullYear() ), // template name without extension
   
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`Welcome email sent to ${userEmail}`);
//   } catch (err) {
//     console.error("Error sending email:", err);
//   }
// }




async function waitlist(userEmail) {
  const transporter = await createTransporter();
const userName = userEmail.split("@")[0] 
  const mailOptions = {
    from: `ClusterClear <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Thanks for joining ",
     html: waitList(userName, new Date().getFullYear()),// template name without extension

  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}






module.exports = {sendVerificationEmail, sendPasswordResetEmail, welcomeEmail,waitlist};
