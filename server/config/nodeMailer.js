import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth: {
        user: process.env.SENDER_EMAIL, // Replace with your email
        pass: 'mbbytmzfdeieydla'        // Replace with your email password or app-specific password
    }
});

export default transporter;