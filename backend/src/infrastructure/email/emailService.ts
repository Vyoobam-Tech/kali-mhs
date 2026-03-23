import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { emailConfig } from '@config/email';

export interface EmailOptions {
    to: string | string[];
    subject: string;
    template?: string;
    context?: Record<string, any>;
    html?: string;
    text?: string;
    attachments?: Array<{
        filename: string;
        path?: string;
        content?: Buffer;
    }>;
}

export class EmailService {
    private transporter: nodemailer.Transporter;
    private templateCache: Map<string, handlebars.TemplateDelegate> = new Map();

    constructor() {
        this.transporter = nodemailer.createTransport(emailConfig.smtp);
    }

    /**
     * Send an email
     */
    async sendEmail(options: EmailOptions): Promise<void> {
        try {
            let htmlContent = options.html;
            let textContent = options.text;

            // Render template if provided
            if (options.template && options.context) {
                htmlContent = await this.renderTemplate(options.template, options.context);
                // Generate plain text from HTML (basic implementation)
                textContent = htmlContent.replace(/<[^>]*>/g, '');
            }

            const mailOptions = {
                from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
                to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
                subject: options.subject,
                html: htmlContent,
                text: textContent,
                attachments: options.attachments,
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email sent: ${info.messageId}`);
        } catch (error) {
            console.error('❌ Email sending failed:', error);
            throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Render email template with Handlebars
     */
    private async renderTemplate(templateName: string, context: Record<string, any>): Promise<string> {
        try {
            // Check cache first
            let template = this.templateCache.get(templateName);

            if (!template) {
                // Load template from file
                const templatePath = path.join(
                    process.cwd(),
                    emailConfig.templates.path,
                    `${templateName}.hbs`
                );
                const templateContent = await fs.readFile(templatePath, 'utf-8');

                // Compile template
                template = handlebars.compile(templateContent);

                // Cache template
                this.templateCache.set(templateName, template);
            }

            // Render template with context
            return template(context);
        } catch (error) {
            console.error(`❌ Template rendering failed for ${templateName}:`, error);
            throw new Error(`Failed to render template: ${templateName}`);
        }
    }

    /**
     * Verify SMTP connection
     */
    async verifyConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            console.log('✅ SMTP connection verified');
            return true;
        } catch (error) {
            console.error('❌ SMTP connection failed:', error);
            return false;
        }
    }

    /**
     * Send password reset email
     */
    async sendPasswordResetEmail(to: string, firstName: string, resetUrl: string): Promise<void> {
        await this.sendEmail({
            to,
            subject: 'Reset your Kali MHS password',
            html: `
                <p>Hi ${firstName},</p>
                <p>We received a request to reset your password. Click the link below to choose a new one:</p>
                <p><a href="${resetUrl}" style="background:#0f172a;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">Reset Password</a></p>
                <p>This link expires in <strong>1 hour</strong>.</p>
                <p>If you didn't request a password reset, you can safely ignore this email.</p>
                <hr/>
                <p style="font-size:12px;color:#666;">Kali MHS &mdash; ${resetUrl}</p>
            `,
        });
    }

    /**
     * Send RFQ confirmation to customer
     */
    async sendRFQConfirmation(to: string, rfqData: any): Promise<void> {
        await this.sendEmail({
            to,
            subject: `RFQ Confirmation - ${rfqData.rfqNumber}`,
            template: 'rfq-confirmation',
            context: {
                rfqNumber: rfqData.rfqNumber,
                customerName: rfqData.contactName,
                items: rfqData.items,
                projectDetails: rfqData.projectDetails,
                submittedAt: new Date(rfqData.createdAt).toLocaleString(),
            },
        });
    }

    /**
     * Send RFQ notification to admin
     */
    async sendRFQAdminNotification(rfqData: any): Promise<void> {
        await this.sendEmail({
            to: emailConfig.adminEmails,
            subject: `New RFQ Received - ${rfqData.rfqNumber}`,
            template: 'rfq-admin-notification',
            context: {
                rfqNumber: rfqData.rfqNumber,
                customerName: rfqData.contactName,
                customerEmail: rfqData.contactEmail,
                customerPhone: rfqData.contactPhone,
                company: rfqData.companyName,
                itemCount: rfqData.items.length,
                submittedAt: new Date(rfqData.createdAt).toLocaleString(),
                viewUrl: `${process.env.FRONTEND_URL}/dashboard/rfq/${rfqData.id}`,
            },
        });
    }

    /**
     * Send lead capture confirmation
     */
    async sendLeadConfirmation(to: string, leadData: any): Promise<void> {
        await this.sendEmail({
            to,
            subject: 'Thank you for your interest - Kali MHS',
            template: 'lead-confirmation',
            context: {
                name: leadData.name,
                documentTitle: leadData.documentTitle,
                downloadUrl: leadData.downloadUrl,
            },
        });
    }

    /**
     * Send job application confirmation
     */
    async sendApplicationConfirmation(to: string, applicationData: any): Promise<void> {
        await this.sendEmail({
            to,
            subject: `Application Received - ${applicationData.jobTitle}`,
            template: 'application-confirmation',
            context: {
                applicantName: `${applicationData.firstName} ${applicationData.lastName}`,
                jobTitle: applicationData.jobTitle,
                submittedAt: new Date(applicationData.submittedAt).toLocaleString(),
            },
        });
    }

    /**
     * Send application notification to HR
     */
    async sendApplicationHRNotification(applicationData: any): Promise<void> {
        await this.sendEmail({
            to: emailConfig.adminEmails, // HR email should be in admin emails
            subject: `New Application - ${applicationData.jobTitle}`,
            template: 'application-hr-notification',
            context: {
                applicantName: `${applicationData.firstName} ${applicationData.lastName}`,
                applicantEmail: applicationData.email,
                applicantPhone: applicationData.phone,
                jobTitle: applicationData.jobTitle,
                resumeUrl: applicationData.resumeUrl,
                submittedAt: new Date(applicationData.submittedAt).toLocaleString(),
                viewUrl: `${process.env.FRONTEND_URL}/dashboard/careers/${applicationData.jobId}/applications/${applicationData.id}`,
            },
        });
    }
}

// Export singleton instance
export const emailService = new EmailService();
