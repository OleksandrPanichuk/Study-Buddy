import * as path from 'path';

export enum TEMPLATES {
  RESET_PASSWORD = 'RESET_PASSWORD',
  WELCOME = 'WELCOME',
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
}

export const TEMPLATES_DIR = path.join(process.cwd(), 'templates');

export const TEMPLATE_PATHS = {
  RESET_PASSWORD: {
    subject: path.join(TEMPLATES_DIR, 'reset-password', 'subject.hbs'),
    html: path.join(TEMPLATES_DIR, 'reset-password', 'html.hbs'),
    text: path.join(TEMPLATES_DIR, 'reset-password', 'text.hbs'),
  },
  WELCOME: {
    subject: path.join(TEMPLATES_DIR, 'welcome', 'subject.hbs'),
    html: path.join(TEMPLATES_DIR, 'welcome', 'html.hbs'),
    text: path.join(TEMPLATES_DIR, 'welcome', 'text.hbs'),
  },
  EMAIL_VERIFICATION: {
    subject: path.join(TEMPLATES_DIR, 'email-verification', 'subject.hbs'),
    html: path.join(TEMPLATES_DIR, 'email-verification', 'html.hbs'),
    text: path.join(TEMPLATES_DIR, 'email-verification', 'text.hbs'),
  },
} as const;
