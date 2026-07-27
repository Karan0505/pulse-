import nodemailer from 'nodemailer';
import { config } from '../config';
import { logger } from '../logger/logger';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    auth: config.email.user
      ? {
          user: config.email.user,
          pass: config.email.pass,
        }
      : undefined,
  });

  public static async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: config.email.from,
        to: email,
        subject: `Welcome to ${config.appName}!`,
        html: `
          <h1>Welcome, ${firstName}!</h1>
          <p>Thank you for signing up to ${config.appName}. We are excited to have you on board!</p>
        `,
      });
      logger.info({ email }, 'Welcome email sent successfully');
    } catch (err) {
      logger.error({ err, email }, 'Failed to send welcome email');
    }
  }

  public static async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    try {
      const resetUrl = `${config.cors.origin}/reset-password?token=${resetToken}`;
      await this.transporter.sendMail({
        from: config.email.from,
        to: email,
        subject: `Password Reset Request - ${config.appName}`,
        html: `
          <h2>Password Reset Request</h2>
          <p>Please click the link below to reset your password:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>This token expires in 1 hour.</p>
        `,
      });
      logger.info({ email }, 'Password reset email sent successfully');
    } catch (err) {
      logger.error({ err, email }, 'Failed to send password reset email');
    }
  }

  public static async sendVerificationEmail(email: string, verifyToken: string): Promise<void> {
    try {
      const verifyUrl = `${config.cors.origin}/verify-email?token=${verifyToken}`;
      await this.transporter.sendMail({
        from: config.email.from,
        to: email,
        subject: `Verify Your Email - ${config.appName}`,
        html: `
          <h2>Email Verification</h2>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verifyUrl}">${verifyUrl}</a>
        `,
      });
      logger.info({ email }, 'Verification email sent successfully');
    } catch (err) {
      logger.error({ err, email }, 'Failed to send email verification');
    }
  }
}
