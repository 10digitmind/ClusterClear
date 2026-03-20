
const createTransporter = require("../Mailer/nodemailer");
const { waitList } = require("../views/waitlist");

async function sendVerificationEmail(userEmail, userName, token) {
  const transporter = await createTransporter();
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `ClusterClear <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Verify Your Email",
    template: "verifyEmail", // template name without extension
    context: {
      name: userName,
      verificationUrl,
      year: new Date().getFullYear(),
    },
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
    template: "resetEmailPassword", // template name without extension
    context: {
      name: userName,
      resetUrl,
      year: new Date().getFullYear(),
    },
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
    template: "welcome", // template name without extension
    context: {
      name: name,
      dashboardUrl,
    },
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${userEmail}`);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}


async function changePasswordEmail(userEmail, name, resetUrl,changedAt) {
  const transporter = await createTransporter();

  const mailOptions = {
   from: `ClusterClear <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Password Changed Successfully",
    template: "passwordChanged", // template name without extension
    context: {
      name: name,
      resetUrl,
      changedAt,
          year: new Date().getFullYear()
    },
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${userEmail}`);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}


async function mock(userEmail) {
  const transporter = await createTransporter();

  const mailOptions = {
    from: `ClusterClear <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "A fan paid ₦10,000 to message you",
    template: "mock", // template name without extension
    context: {
     
    },
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
// mock('olubodekehinde2019@gmail.com')





module.exports = {sendVerificationEmail, sendPasswordResetEmail, welcomeEmail,changePasswordEmail,waitlist};
