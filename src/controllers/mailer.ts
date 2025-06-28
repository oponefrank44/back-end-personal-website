import sgMail, { MailDataRequired } from '@sendgrid/mail';
import { config } from 'dotenv';

// Load environment variables
config();

// Define types for our email options
interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, unknown>;
}

class SendGridService {
  constructor() {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY is not defined in environment variables');
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  /**
   * Send a basic email
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const msg: MailDataRequired = {
        to: options.to,
        from: process.env.SENDGRID_FROM_EMAIL as string,
        subject: options.subject,
        content: [
          options.html
            ? { type: 'text/html', value: options.html }
            : { type: 'text/plain', value: options.text || '' }
        ]
      };
    

      

      await sgMail.send(msg);
      console.log('Email sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  /**
   * Send email using a SendGrid template
   */
  async sendTemplateEmail(
    templateId: string,
    options: Omit<EmailOptions, 'html' | 'text'> & {
      dynamicTemplateData: Record<string, unknown>;
    }
  ): Promise<boolean> {
    try {
      const msg = {
        to: options.to,
        from: process.env.SENDGRID_FROM_EMAIL as string,
        templateId,
        dynamicTemplateData: options.dynamicTemplateData,
      };

      await sgMail.send(msg);
      console.log('Template email sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending template email:', error);
      return false;
    }
  }
}

export const sendGridService = new SendGridService();