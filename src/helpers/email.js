/* eslint-disable prefer-template */
import nodemailer from 'nodemailer';

require('dotenv').config();

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

transporter.sendMail({
  from: 'noreply@runesx.com',
  to: 'bagostra@gmail.com',
  subject: 'test',
  html: 'test',
}).then(() => {
  console.log('Email sent successfully');
}).catch((err) => {
  console.log('Failed to send email');
  console.error(err);
});

const from = process.env.MAIL_FROM;

export function sendVerificationEmail(email, firstName, token) {
  console.log('send verification email');
  console.log(email);
  console.log(process.env.MAIL_HOST);
  console.log(process.env.MAIL_PORT);
  console.log(process.env.MAIL_USER);
  console.log(process.env.MAIL_PASS);
  const html = "<div style='margin: 0; padding: 0; width: 100%; font-family: Trebuchet MS, sans-serif;'>"
    + "<div style='background-color: #f2f2f2; padding: 45px;'>"
    + "<div style='background-color: #ffffff; padding: 40px; text-align: center;'>"
    + "<h1 style='color: #5f5f5f; margin-bottom: 30px;'>Hi, " + firstName + "</h1>"
    + "<p style='color: #5f5f5f;'>Click the big button below to activate your account.</p>"
    + "<a href='" + process.env.ROOT_URL + "/verify-email/?email=" + email + "&token=" + token + "' style='background-color: #288feb; color: #fff; padding: 14px; text-decoration: none; border-radius: 5px; margin-top: 20px; display: inline-block;'>Activate Account</a>"
    + "</div></div></div>";

  transporter.verify((error, success) => {
    if (error) {
      console.log('failed to verify');
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Verify Email',
    html,
  }).then(() => {
    console.log('Email sent successfully');
  }).catch((err) => {
    console.log('Failed to send email');
    console.error(err);
  });

  // transporter.sendMail({
  //  from,
  //  to: email,
  //  subject: 'Verify Email',
  //  html,
  // }, (err) => { if (err) { return err; } });
}

export function sendResetPassword(email, firstName, token) {
  const html = "<div style='margin: 0; padding: 0; width: 100%; font-family: Trebuchet MS, sans-serif;'>"
    + "<div style='background-color: #f2f2f2; padding: 45px;'>"
    + "<div style='background-color: #ffffff; padding: 40px; text-align: center;'>"
    + "<h1 style='color: #5f5f5f; margin-bottom: 30px;'>Hi, " + firstName + "</h1>"
    + "<p style='color: #5f5f5f; line-height: 22px;'>We've received a request to reset your password. if you didn't make the request, just ignore this email. Otherwise, you can reset your password using this link</p>"
    + "<a href='" + process.env.ROOT_URL + "/reset-password/new?email=" + email + "&token=" + token + "' style='background-color: #288feb; color: #fff; padding: 14px; text-decoration: none; border-radius: 5px; margin-top: 20px; display: inline-block;'>Click here to reset your password</a>"
    + "</div></div></div>";

  console.log('sent');
  transporter.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Password Reset',
    html,
  }).then(() => {
    console.log('Email sent successfully');
  }).catch((err) => {
    console.log('Failed to send email');
    console.error(err);
  });
}
