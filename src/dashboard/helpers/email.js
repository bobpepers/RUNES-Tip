/* eslint-disable prefer-template */
import nodemailer from 'nodemailer';
import { config } from "dotenv";

config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // use SSL
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    requireTLS: true,
  },
});

// transporter.sendMail({
//   from: process.env.MAIL_USER,
//   to: 'bagostra@gmail.com',
//   subject: 'Nodejs application restarted',
//   html: 'test',
// }).then(() => {
//   console.log('Email sent successfully');
// }).catch((err) => {
//   console.log('Failed to send email');
//   console.error(err);
// });

const sendEmail = (
  from,
  to,
  subject,
  html,
) => new Promise((resolve, reject) => {
  transporter.sendMail({
    from,
    to,
    subject,
    html,
  }, (error, info) => {
    if (error) {
      console.log("error is " + error);
      resolve(false);
    } else {
      console.log('Email sent: ' + info.response);
      resolve(true);
    }
  });
});

const verifySend = () => new Promise((resolve, reject) => {
  transporter.verify((
    error,
    success,
  ) => {
    if (error) {
      resolve(false);
      console.log(error);
    } else {
      resolve(true);
    }
  });
});

export const sendVerificationEmail = async (
  email,
  token,
) => {
  const html = "<div style='margin: 0; padding: 0; width: 100%; font-family: Trebuchet MS, sans-serif;'>"
    + "<div style='background-color: #f2f2f2; padding: 45px;'>"
    + "<div style='background-color: #ffffff; padding: 40px; text-align: center;'>"
    + "<h1 style='color: #5f5f5f; margin-bottom: 30px;'>Hello</h1>"
    + "<p style='color: #5f5f5f;'>Click the big button below to activate your account.</p>"
    + "<a href='" + process.env.ROOT_URL + "/register/verify-email?email=" + email + "&token=" + token + "' style='background-color: #288feb; color: #fff; padding: 14px; text-decoration: none; border-radius: 5px; margin-top: 20px; display: inline-block;'>Activate Account</a>"
    + "</div></div></div>";

  const waitForVerify = await verifySend();
  if (!waitForVerify) {
    return false;
  }

  const waitForEmail = await sendEmail(
    process.env.MAIL_USER,
    email,
    'Verify Email',
    html,
  );
  return waitForEmail;
};

export const sendResetPassword = async (
  email,
  firstName,
  token,
) => {
  const html = "<div style='margin: 0; padding: 0; width: 100%; font-family: Trebuchet MS, sans-serif;'>"
    + "<div style='background-color: #f2f2f2; padding: 45px;'>"
    + "<div style='background-color: #ffffff; padding: 40px; text-align: center;'>"
    + "<h1 style='color: #5f5f5f; margin-bottom: 30px;'>Hi, " + firstName + "</h1>"
    + "<p style='color: #5f5f5f; line-height: 22px;'>We've received a request to reset your password. if you didn't make the request, just ignore this email. Otherwise, you can reset your password using this link</p>"
    + "<a href='" + process.env.ROOT_URL + "/reset-password/new?email=" + email + "&token=" + token + "' style='background-color: #288feb; color: #fff; padding: 14px; text-decoration: none; border-radius: 5px; margin-top: 20px; display: inline-block;'>Click here to reset your password</a>"
    + "</div></div></div>";

  const waitForVerify = await verifySend();
  if (!waitForVerify) {
    return false;
  }

  const waitForEmail = await sendEmail(
    process.env.MAIL_USER,
    email,
    'Password Reset',
    html,
  );
  return waitForEmail;
};
