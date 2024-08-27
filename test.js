const { EmailService, EmailProviderA, EmailProviderB } = require('./main');

const emailProviderA = new EmailProviderA();
const emailProviderB = new EmailProviderB();
const emailService = new EmailService([emailProviderA, emailProviderB]);

const emailStatus = [];
const providerStatus = [];

const emails = [
    {
        to: 'user1@example.com',
        subject: 'Test Email 1',
        body: 'This is a test email 1.'
    },
    {
        to: 'user2@example.com',
        subject: 'Test Email 2',
        body: 'This is a test email 2.'
    },
    {
        to: 'user1@example.com',
        subject: 'Test Email 1',
        body: 'This is a test email 1.'
    },
    {
        to: 'user4@example.com',
        subject: 'Test Email 4',
        body: 'This is a test email 4.'
    },
    {
        to: 'user5@example.com',
        subject: 'Test Email 5',
        body: 'This is a test email 5.'
    },
    {
        to: 'user6@example.com',
        subject: 'Test Email 6',
        body: 'This is a test email 6.'
    },
    {
        to: 'user7@example.com',
        subject: 'Test Email 7',
        body: 'This is a test email 7.'
    },
    {
        to: 'user8@example.com',
        subject: 'Test Email 8',
        body: 'This is a test email 8.'
    },
    {
        to: 'user9@example.com',
        subject: 'Test Email 9',
        body: 'This is a test email 9.'
    },
    {
        to: 'user6@example.com',
        subject: 'Test Email 6',
        body: 'This is a test email 6.'
    },
    {
        to: 'user11@example.com',
        subject: 'Test Email 11',
        body: 'This is a test email 11.'
    },
    {
        to: 'user12@example.com',
        subject: 'Test Email 12',
        body: 'This is a test email 12.'
    },
    {
        to: 'user13@example.com',
        subject: 'Test Email 13',
        body: 'This is a test email 13.'
    },
    {
        to: 'user12@example.com',
        subject: 'Test Email 12',
        body: 'This is a test email 12.'
    },
    {
        to: 'user15@example.com',
        subject: 'Test Email 15',
        body: 'This is a test email 15.'
    },
    {
        to: 'user16@example.com',
        subject: 'Test Email 16',
        body: 'This is a test email 16.'
    },
    {
        to: 'user17@example.com',
        subject: 'Test Email 17',
        body: 'This is a test email 17.'
    },
    {
        to: 'user18@example.com',
        subject: 'Test Email 18',
        body: 'This is a test email 18.'
    },
    {
        to: 'user19@example.com',
        subject: 'Test Email 19',
        body: 'This is a test email 19.'
    },
    {
        to: 'user18@example.com',
        subject: 'Test Email 18',
        body: 'This is a test email 18.'
    },
];

emailService.sendEmail(emails, emailStatus, providerStatus);