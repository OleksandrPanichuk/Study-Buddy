import * as fs from "node:fs/promises";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Handlebars from "handlebars";
import { createTransport, Transporter } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import type { Env } from "@/shared/config";
import { TEMPLATE_PATHS, TEMPLATES } from "./mailer.constants";
import { IEmailOptions, IMailOptions } from "./mailer.types";

@Injectable()
export class MailerService implements OnModuleInit {
  private readonly logger = new Logger(MailerService.name);
  private readonly defaultFrom: string;

  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY_MS = 1000;

  private compiledTemplates: Map<
    TEMPLATES,
    {
      subject: Handlebars.TemplateDelegate;
      html: Handlebars.TemplateDelegate;
      text: Handlebars.TemplateDelegate;
    }
  > = new Map();

  private transporter: Transporter;

  private isInitialized = false;

  constructor(private readonly config: ConfigService<Env>) {
    this.defaultFrom = this.config.get<string>("MAIL_FROM")!;

    this.transporter = createTransport({
      host: config.get("MAIL_HOST"),
      port: Number.parseInt(config.get("MAIL_PORT")!, 10),
      secure: true,
      auth: {
        user: config.get("MAIL_USER"),
        pass: config.get("MAIL_PASSWORD"),
      },
      from: this.defaultFrom,
    });

    this.registerHandlebarsHelpers();
  }

  async onModuleInit(): Promise<void> {
    await this.loadTemplates();
    await this.verifyTransporter();
    this.isInitialized = true;
    this.logger.log("MailerService initialized and templates loaded.");
  }

  public async sendWelcomeEmail(
    email: string,
    userName: string,
    dashboardLink: string,
  ): Promise<void> {
    await this.sendEmail({
      to: email,
      template: TEMPLATES.WELCOME,
      variables: {
        userName,
        dashboardLink,
      },
    });
  }

  public async sendPasswordResetEmail(
    email: string,
    resetLink: string,
    userName?: string,
    expiresIn = 15,
  ): Promise<void> {
    await this.sendEmail({
      to: email,
      template: TEMPLATES.RESET_PASSWORD,
      variables: {
        userName,
        resetLink,
        expiresIn,
      },
    });
  }

  public async sendEmailVerification(
    email: string,
    userName: string,
    verificationCode: string,
    expiresIn = 30,
  ): Promise<void> {
    await this.sendEmail({
      to: email,
      template: TEMPLATES.EMAIL_VERIFICATION,
      variables: {
        userName,
        verificationCode,
        expiresIn,
      },
    });
  }

  public async sendEmail(options: IEmailOptions): Promise<void> {
    const { to, template, variables, from, bcc, cc, replyTo } = options;
    const rendered = this.renderTemplate(template, variables);

    const toAddresses = Array.isArray(to) ? to : [to];
    const ccAddresses = cc ? (Array.isArray(cc) ? cc : [cc]) : undefined;
    const bccAddresses = bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : undefined;
    const replyToAddresses = replyTo
      ? Array.isArray(replyTo)
        ? replyTo.join(", ")
        : replyTo
      : undefined;

    const mailOptions: IMailOptions = {
      from: from || this.defaultFrom,
      to: toAddresses.join(", "),
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
      ...(ccAddresses && { cc: ccAddresses.join(", ") }),
      ...(bccAddresses && { bcc: bccAddresses.join(", ") }),
      ...(replyToAddresses && { replyTo: replyToAddresses }),
    };

    await this.sendWithRetry(mailOptions, toAddresses, template);
  }

  private async verifyTransporter(): Promise<void> {
    try {
      const result = await this.transporter.verify();

      if (result) {
        this.logger.log(
          "SMTP connection verified - transporter is ready to send emails",
        );
      }
    } catch (error) {
      this.logger.error(
        "Failed to verify SMTP connection",
        error instanceof Error ? error.stack : error,
      );
      throw new Error(
        "SMTP transporter verification failed. Check your mail configuration.",
      );
    }
  }

  private async sendWithRetry(
    mailOptions: IMailOptions,
    recipients: string[],
    template: TEMPLATES,
    attempt = 1,
  ): Promise<void> {
    try {
      const info: SMTPTransport.SentMessageInfo =
        await this.transporter.sendMail(mailOptions);

      this.logger.log(
        `Email sent successfully to ${recipients.join(", ")} using template ${template} (messageId: ${info.messageId})`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (attempt < this.MAX_RETRIES) {
        const delayMs = this.RETRY_DELAY_MS * attempt;
        this.logger.warn(
          `Attempt ${attempt}/${this.MAX_RETRIES} to send email failed: ${errorMessage}. Retrying in ${delayMs}ms...`,
        );
        await this.delay(delayMs);
        return this.sendWithRetry(
          mailOptions,
          recipients,
          template,
          attempt + 1,
        );
      }

      this.logger.error(
        `Failed to send email to ${recipients.join(", ")} using template ${template} after ${attempt} attempts: ${errorMessage}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
  }

  private registerHandlebarsHelpers(): void {
    Handlebars.registerHelper("currency", (value: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    });

    Handlebars.registerHelper("formatDate", (date: Date | string) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    });

    Handlebars.registerHelper("uppercase", (str: string) => {
      return str.toUpperCase();
    });

    Handlebars.registerHelper("eq", (a: unknown, b: unknown) => {
      return a === b;
    });

    Handlebars.registerHelper("gt", (a: number, b: number) => {
      return a > b;
    });

    Handlebars.registerHelper("or", (...args: unknown[]) => {
      const values = args.slice(0, -1);
      return values.some(Boolean);
    });
  }

  private async loadTemplates(): Promise<void> {
    const templateKeys = Object.keys(TEMPLATE_PATHS) as TEMPLATES[];

    for (const templateKey of templateKeys) {
      try {
        const paths = TEMPLATE_PATHS[templateKey];

        const [subjectContent, htmlContent, textContent] = await Promise.all([
          this.readTemplateFile(paths.subject),
          this.readTemplateFile(paths.html),
          this.readTemplateFile(paths.text),
        ]);

        this.compiledTemplates.set(templateKey, {
          subject: Handlebars.compile(subjectContent),
          html: Handlebars.compile(htmlContent),
          text: Handlebars.compile(textContent),
        });

        this.logger.log(`Template loaded and compiled: ${templateKey}`);
      } catch (error) {
        this.logger.error(`Failed to load template: ${templateKey}`, error);
        throw new Error(`Template loading failed: ${templateKey}`);
      }
    }
  }

  private async readTemplateFile(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, "utf-8");
    } catch (error) {
      this.logger.error(`Failed to read template file: ${filePath}`, error);
      throw new Error(`Template file not found: ${filePath}`);
    }
  }

  public async reloadTemplate(template: TEMPLATES): Promise<void> {
    const paths = TEMPLATE_PATHS[template];

    if (!paths) {
      throw new Error(`Template not found: ${template}`);
    }

    const [subjectContent, htmlContent, textContent] = await Promise.all([
      this.readTemplateFile(paths.subject),
      this.readTemplateFile(paths.html),
      this.readTemplateFile(paths.text),
    ]);

    this.compiledTemplates.set(template, {
      subject: Handlebars.compile(subjectContent),
      html: Handlebars.compile(htmlContent),
      text: Handlebars.compile(textContent),
    });

    this.logger.log(`Template reloaded: ${template}`);
  }

  public async reloadAllTemplates(): Promise<void> {
    await this.loadTemplates();
    this.logger.log("All templates reloaded");
  }

  private renderTemplate(
    template: TEMPLATES,
    variables: Record<string, unknown>,
  ): { subject: string; html: string; text: string } {
    if (!this.isInitialized) {
      throw new Error("MailerService not initialized. Templates not loaded.");
    }

    const compiledTemplate = this.compiledTemplates.get(template);

    if (!compiledTemplate) {
      throw new Error(`Template not found: ${template}`);
    }

    const templateVariables = {
      appName: this.config.get<string>("APP_NAME") || "Our App",
      currentYear: new Date().getFullYear(),
      supportEmail: this.config.get("SUPPORT_EMAIL"),
      ...variables,
    };

    try {
      return {
        subject: compiledTemplate.subject(templateVariables),
        html: compiledTemplate.html(templateVariables),
        text: compiledTemplate.text(templateVariables),
      };
    } catch (error) {
      this.logger.error(`Failed to render template: ${template}`, error);
      throw new Error(`Template rendering failed: ${template}`);
    }
  }

  public getAvailableTemplates(): TEMPLATES[] {
    return Object.values(TEMPLATES);
  }

  public previewTemplate(
    template: TEMPLATES,
    variables: Record<string, unknown>,
  ): { subject: string; html: string; text: string } {
    return this.renderTemplate(template, variables);
  }

  public isReady(): boolean {
    return this.isInitialized;
  }
}
