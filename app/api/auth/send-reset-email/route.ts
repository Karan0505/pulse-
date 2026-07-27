import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const resetToken = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const resetUrl = `${protocol}://${host}/reset-password?email=${encodeURIComponent(email)}&token=${resetToken}`;

    const userName = email.split("@")[0].replace(/[._]/g, " ");

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Pulse" <noreply@pulsebackend.com>',
      to: email,
      subject: "Reset your Pulse password",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; color: #333333; margin: 0; padding: 40px 10px; }
            .card { max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
            .header { border-top: 4px solid #1d63ed; padding: 28px 40px 20px; text-align: center; }
            .logo-text { font-size: 26px; font-weight: 800; color: #1d63ed; letter-spacing: -0.5px; }
            .content { padding: 20px 40px 40px; color: #555555; font-size: 15px; line-height: 1.6; }
            .greeting { font-size: 16px; color: #333333; margin-bottom: 16px; font-weight: 500; }
            .email-link { color: #1d63ed; text-decoration: underline; }
            .btn-wrapper { text-align: center; margin: 32px 0; }
            .btn { background-color: #1d63ed; color: #ffffff !important; font-weight: 600; font-size: 15px; padding: 12px 36px; border-radius: 9999px; text-decoration: none; display: inline-block; box-shadow: 0 4px 10px rgba(29,99,237,0.25); }
            .footer { font-size: 14px; color: #666666; margin-top: 24px; line-height: 1.5; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div class="logo-text">⚡ Pulse</div>
            </div>
            <div class="content">
              <div class="greeting">Dear ${userName},</div>
              
              <p>We have received an account sign up/password reset request for your Pulse account: <a href="mailto:${email}" class="email-link">${email}</a></p>
              
              <p>Simply click on the button below to set a new password</p>

              <div class="btn-wrapper">
                <a href="${resetUrl}" target="_blank" class="btn">Reset password</a>
              </div>

              <div class="footer">
                Regards,<br>
                <strong>Pulse Team</strong>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    let testUrl: string | false | null = null;
    let emailSent = false;

    // 1. Try environment SMTP if valid credentials provided (not placeholder testuser)
    const isPlaceholderSmtp =
      !process.env.SMTP_USER ||
      process.env.SMTP_USER.toLowerCase().includes("testuser") ||
      process.env.SMTP_USER.toLowerCase().includes("your_user");

    if (process.env.SMTP_HOST && !isPlaceholderSmtp) {
      try {
        const cleanPass = (process.env.SMTP_PASS || "").replace(/\s+/g, "");
        const isGmail = process.env.SMTP_HOST.includes("gmail");

        const transporter = nodemailer.createTransport(
          isGmail
            ? {
                service: "gmail",
                auth: {
                  user: process.env.SMTP_USER,
                  pass: cleanPass,
                },
              }
            : {
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 465,
                secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465",
                auth: {
                  user: process.env.SMTP_USER,
                  pass: cleanPass,
                },
              }
        );

        const info = await transporter.sendMail(mailOptions);
        console.log("Password reset email sent successfully via Nodemailer. Message ID:", info.messageId);
        testUrl = nodemailer.getTestMessageUrl(info);
        emailSent = true;
      } catch (smtpErr) {
        console.error("Configured Gmail/SMTP failed to send mail:", smtpErr);
      }
    }

    // 2. Fallback to Ethereal / Direct Link generator if SMTP failed or placeholder was used
    if (!emailSent) {
      try {
        const testAccount = await nodemailer.createTestAccount();
        const testTransporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        const info = await testTransporter.sendMail(mailOptions);
        testUrl = nodemailer.getTestMessageUrl(info);
        emailSent = true;
      } catch (etherealErr) {
        console.warn("Ethereal test mail fallback error:", etherealErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Password reset link generated successfully",
      resetUrl,
      testUrl: testUrl || null,
    });
  } catch (error) {
    console.error("Nodemailer reset email error:", error);
    return NextResponse.json(
      { error: "Failed to send reset email via Nodemailer" },
      { status: 500 }
    );
  }
}
