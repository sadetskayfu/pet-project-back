import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;
    private readonly logger = new Logger(MailService.name)

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

        this.logger.log(`Sending a message by email '${email}'`)
        
        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            this.logger.error(`Cannot send message on email '${email}'`)
        }
    }
}
