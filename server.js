// use Ctrl+C or pm2 stop <app_name_id> to stop server
// nose server.js or nodemon server.js or pm2 restart <app_name_id> to restart server
// pm2 logs <app_name_id> will tail logs for server.js

const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config({ path: "./config.env" });

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (e.g., your HTML and CSS)
app.use(express.static(__dirname));
app.post("/send-email", async (req, res) => {
    const { name, email=process.env.EMAIL_USER, subject, message } = req.body;

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
        service: "gmail", // or any email service provider
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.RECEIVER_EMAIL, // Your email address
        subject: `New Contact Form Submission: ${subject}`,
        text: `You have a new message from ${name} (${email}):\n\n${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.redirect("/contact.html?status=success");
    } catch (error) {
        console.error("Error sending email:", error);
        res.redirect("/contact.html?status=error");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
