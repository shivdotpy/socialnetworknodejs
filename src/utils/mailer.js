const chalk = require("chalk");
const nodemailer = require("nodemailer");
const { FROM_EMAIL } = require("./constants");

const sendEmail = (email, subject, text) => {
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  let mailDetails = {
    from: FROM_EMAIL,
    to: email,
    subject,
    text,
  };

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log(chalk.red("Error Occurs"), err);
    } else {
      console.log("Email sent successfully");
    }
  });
};

module.exports = sendEmail;
