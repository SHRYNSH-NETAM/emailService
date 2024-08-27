const express = require('express');
const bodyParser = require('body-parser');
const { EmailService, EmailProviderA, EmailProviderB } = require('./main'); // Assuming your EmailService is in a separate file

const app = express();
app.use(bodyParser.json());

const emailProviderA = new EmailProviderA();
const emailProviderB = new EmailProviderB();
const emailService = new EmailService([emailProviderA, emailProviderB]);

const emailStatus = [];
const providerStatus = [];

// Define API endpoint to send emails
app.get('/send-emails', async (req, res) => {
    const emails = req.body.emails;

    if (!Array.isArray(emails)) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    await emailService.sendEmail(emails, emailStatus, providerStatus);
    res.status(200).json({
        emailStatus: emailStatus,
        providerStatus: providerStatus
    });
});

app.get("/", (req, res) => res.send("Express on Vercel"));

app.get("/testing", (req, res) => res.send("Testing Path"));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});