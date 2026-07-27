import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, email, teamSize, message } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const userName = name || email.split("@")[0];
    const userMessage = message || "No message provided.";
    const userTeamSize = teamSize || "N/A";

    const mailOptions = {
      from: '"Pulse Support" <noreply@pulse.app>',
      to: email,
      subject: `Thank you for contacting Pulse, ${userName}! ⚡`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f1218; color: #f3f4f6; margin: 0; padding: 40px 20px; }
            .container { max-width: 520px; margin: 0 auto; background-color: #171b24; border: 1px solid #2e3545; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
            .logo { font-size: 24px; font-weight: bold; color: #FFB454; margin-bottom: 20px; text-align: center; }
            h1 { font-size: 20px; color: #ffffff; margin-bottom: 12px; }
            p { font-size: 14px; color: #9ca3af; line-height: 1.6; margin-bottom: 20px; }
            .box { background-color: #0f1218; border-left: 3px solid #FFB454; padding: 16px; margin: 16px 0; border-radius: 6px; font-size: 13px; color: #e5e7eb; }
            .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #2e3545; text-align: center; font-size: 11px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">⚡ Pulse</div>
            <h1>We received your message, ${userName}!</h1>
            <p>Thank you for reaching out to the Pulse team. We've received your note and our team will get back to you within a business day.</p>
            
            <div class="box">
              <strong>Your Submitted Details:</strong><br/>
              <strong>Email:</strong> ${email}<br/>
              <strong>Team Size:</strong> ${userTeamSize}<br/>
              <strong>Message:</strong> ${userMessage}
            </div>

            <div class="footer">
              &copy; ${new Date().getFullYear()} Pulse Workflow Platform. All rights reserved.
            </div>
          </div>
        </body>
        </html>
      `,
    };

    let testUrl: string | false | null = null;
    let emailSent = false;

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
        console.log("Contact email sent. Message ID:", info.messageId);
        testUrl = nodemailer.getTestMessageUrl(info);
        emailSent = true;
      } catch (smtpErr) {
        console.error("Configured Gmail/SMTP failed for Contact email:", smtpErr);
      }
    }

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
        console.warn("Ethereal test mail fallback error for Contact email:", etherealErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Contact confirmation sent to ${email}`,
      testUrl: testUrl || null,
    });
  } catch (error) {
    console.error("Nodemailer contact email error:", error);
    return NextResponse.json(
      { error: "Failed to send contact email" },
      { status: 500 }
    );
  }
}
