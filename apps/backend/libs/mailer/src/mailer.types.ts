import { TEMPLATES } from './mailer.constants';
import { SendMailOptions } from 'nodemailer';

export interface IEmailOptions {
  to: string | string[];
  template: TEMPLATES;
  variables: Record<string, any>;
  from?: string;
  replyTo?: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
}

export interface IMailOptions extends SendMailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  cc?: string;
  bcc?: string;
  replyTo?: string;
}
