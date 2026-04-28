
const createTransporter = require("../Mailer/nodemailer");
const resetEmailPassword = require("../htmlDesigns/resetEmailPassword");
const passwordChange = require("../htmlDesigns/passwordChange");
const verifyEmail = require("../htmlDesigns/verfiyEmail");
const waitList = require("../htmlDesigns/waitlist");
const welcome = require("../htmlDesigns/welcome");


async function sendVerificationEmail(userEmail, userName, token) {
  const transporter = await createTransporter();
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

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


async function sendPasswordResetEmail(userEmail, userName, resetUrl,changedAt) {
  const transporter = await createTransporter();
const changeAt = new Date(changedAt).toLocaleString("en-US", {
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

  const mailOptions = {
   from: `ClusterClear <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Password reset  request",
    html:resetEmailPassword(userName, resetUrl, changeAt,new Date().getFullYear(),), // template name without extension
  
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


async function changePasswordEmail(userEmail, name, changedAt,resetUrl) {
  const transporter = await createTransporter();

  const mailOptions = {
   from: `ClusterClear <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Password Changed Successfully",
    html: passwordChange( name,changedAt, resetUrl,new Date().getFullYear() ), // template name without extension
   
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${userEmail}`);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}




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






module.exports = {sendVerificationEmail, sendPasswordResetEmail, welcomeEmail,waitlist,changePasswordEmail};
