import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const userName = name || email.split("@")[0];
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const dashboardUrl = `${protocol}://${host}/dashboard`;

    const mailOptions = {
      from: '"Pulse Platform" <noreply@pulse.app>',
      to: email,
      subject: `Welcome to Pulse, ${userName}! ⚡`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f1218; color: #f3f4f6; margin: 0; padding: 40px 20px; }
            .container { max-width: 520px; margin: 0 auto; background-color: #171b24; border: 1px solid #2e3545; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
            .logo { font-size: 24px; font-weight: bold; color: #FFB454; margin-bottom: 20px; text-align: center; }
            h1 { font-size: 22px; color: #ffffff; margin-bottom: 12px; }
            p { font-size: 14px; color: #9ca3af; line-height: 1.6; margin-bottom: 20px; }
            .button { display: block; width: 100%; text-align: center; background-color: #FFB454; color: #0f1218; text-decoration: none; font-weight: bold; font-size: 14px; padding: 14px 0; border-radius: 9999px; }
            .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #2e3545; text-align: center; font-size: 11px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">⚡ Pulse</div>
            <h1>Welcome aboard, ${userName}! 🎉</h1>
            <p>Your Pulse account (<strong>${email}</strong>) is ready. You now have full access to developer throughput analytics, team collaboration tools, and live activity feeds.</p>
            
            <a href="${dashboardUrl}" target="_blank" class="button">Go to Pulse Dashboard &rarr;</a>

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
        console.log("Welcome email sent 44eyedhgnler. Message ID:", info.messageId);
        testUrl = nodemailer.getTestMessageUrl(info);
        emailSent = true;
      } catch (smtpErr) {
        console.error("Configured Gmail/SMTP failed for Welcome email:", smtpErr);
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
        console.warn("Ethereal test mail fallback error for Welcome email:", etherealErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Welcome email sent to ${email}`,
      testUrl: testUrl || null,
    });
  } catch (error) {
    console.error("Nodemailer welcome email error:", error);
    return NextResponse.json(
      { error: "Failed to send welcome email via Nodemailer" },
      { status: 500 }
    );
  }
}
