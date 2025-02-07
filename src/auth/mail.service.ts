import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
	private transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: 'smtp.mail.ru',
			port: 465,
			secure: true,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD,
			},
		});
	}

	async sendConfirmationCode(email: string, code: string) {
		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: email,
			subject: 'Email Confirmation Code',
			text: `Your confirmation code is: ${code}`,
		};

		try {
			this.transporter.sendMail(mailOptions);
		} catch (error) {
			throw new Error('Failed to send email');
		}
	}
}
