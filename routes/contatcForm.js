// const express = require('express');
// const nodemailer = require('nodemailer');
// const nodemailerConfig = require('../nodemailerConfig');
// const router = express.Router();

// router.post('/send-email', async (req, res) => {
//   try {
//     const { name, email, message } = req.body;

//     if (!name || !email || !message) {
//       return res.status(400).json({ error: 'All fields are required.' });
//     }

//     const transporter = nodemailer.createTransport(nodemailerConfig);

//     const mailOptions = {
//       from: nodemailerConfig.auth.user,
//       to: 'globalsuccess080@gmail.com', // Replace with your Gmail address
//       subject: 'New Contact Form Submission',
//       text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log('Email sent successfully');
//     res.status(200).json({ success: true });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// module.exports = router;
const express = require('express');
const nodemailer = require('nodemailer');
const nodemailerConfig = require('../nodemailerConfig');
const fs = require('fs');
const util = require('util');
const ejs = require('ejs');
const router = express.Router();

const readFile = util.promisify(fs.readFile);

router.post('/send-email', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const transporter = nodemailer.createTransport(nodemailerConfig);

    // Load the HTML template
    const template = await readFile('./email-template.html', 'utf-8');

    // Use EJS to render the template with dynamic data
    const html = ejs.render(template, { name, email, message });

    const mailOptions = {
      from: nodemailerConfig.auth.user,
      to: 'globalsuccess080@gmail.com', // Replace with your Gmail address
      subject: 'New Contact Form Submission',
      html: html,
    };

    await transporter.sendMail(mailOptions);
    // console.log('ContactUs form  sent successfully!!');
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
