import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "no-reply@taklif-ai.tech",
    to: email,
    subject: "2F Authentication Code | Taklif.AI",
    html: `    
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Taklif.AI - Two-Factor Authentication</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #1a1a1a; color: #ffffff; padding: 20px;">

            <div style="max-width: 600px; margin: auto; background-color: #252525; border-radius: 10px; padding: 30px;">

                <!-- Logo -->
                <div style="text-align: center;">
                    <img src="https://external-assets-taklif-ai.s3.eu-north-1.amazonaws.com/logo-dark.png" alt="Taklif.AI Logo" style="width: 400px; margin-bottom: 20px;">
                </div>

                <h2 style="text-align: center; color: #ffffff;">Your Two-Factor Authentication Code</h2>
                <p style="text-align: center; color: #cccccc; margin-bottom: 30px;">
                    Hi there! We received a request to log in to your Taklif.AI account.<br>
                    To confirm your identity, please use the verification code below.
                </p>

                <div style="text-align: center; margin: 30px 0;">
                    <span style="background-color: #7861ff; color: #ffffff; padding: 15px 25px; border-radius: 50px; font-size: 20px; font-weight: bold;">
                        ${token}
                    </span>
                </div>

                <p style="text-align: center; font-size: 14px; color: #cccccc;">
                    This code is valid for <strong>5 minutes</strong>. Please do not share it with anyone.
                </p>

                <hr style="border-color: #333; margin: 40px 0;">

                <div style="font-size: 12px; color: #aaa; text-align: center;">
                    <p>If you did not request this code, please secure your account immediately.</p>
                    <p>© 2025 Taklif.AI | All rights reserved.</p>
                </div>

            </div>

        </body>
    </html>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "no-reply@taklif-ai.tech",
    to: email,
    subject: "Reset Your Password | Taklif.AI",
    html: `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Taklif.AI - Reset Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #1a1a1a; color: #ffffff; padding: 20px;">

            <div style="max-width: 600px; margin: auto; background-color: #252525; border-radius: 10px; padding: 30px;">

                <!-- Logo -->
                <div style="text-align: center;">
                    <img src="https://external-assets-taklif-ai.s3.eu-north-1.amazonaws.com/logo-dark.png" alt="Taklif.AI Logo" style="width: 400px; margin-bottom: 20px;">
                </div>

                <h2 style="text-align: center; color: #ffffff;">Reset Your Taklif.AI Password</h2>
                <p style="text-align: center; color: #cccccc; margin-bottom: 30px;">
                    We received a request to reset your Taklif.AI password.<br>
                    Click the button below to proceed.
                </p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" style="text-decoration: none; background-color: #7861ff; color: #ffffff; padding: 12px 30px; border-radius: 50px; font-weight: bold;">
                        Reset Password
                    </a>
                </div>

                <p style="text-align: center; font-size: 14px; color: #cccccc;">
                    If you didn't request a password reset, please ignore this email or secure your account.
                </p>

                <hr style="border-color: #333; margin: 40px 0;">

                <div style="font-size: 12px; color: #aaa; text-align: center;">
                    <p>© 2025 Taklif.AI | All rights reserved.</p>
                </div>

            </div>

        </body>
    </html>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "no-reply@taklif-ai.tech",
    to: email,
    subject: "Please Confirm Your Email | Taklif.AI",
    html: `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Taklif.AI - Email Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #1a1a1a; color: #ffffff; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #252525; border-radius: 10px; padding: 30px;">
                <!-- Logo -->
                <div style="text-align: center;">
                    <img src="https://external-assets-taklif-ai.s3.eu-north-1.amazonaws.com/logo-dark.png" 
                        alt="Taklif.AI Logo" 
                        style="width: 400px; margin-bottom: 20px;">
                </div>

                <h2 style="text-align: center; color: #ffffff;">Welcome to Taklif.AI</h2>
                <p style="text-align: center; color: #cccccc; margin-bottom: 30px;">
                    Thanks for signing up! Please confirm your email address by clicking 
                    the button below to activate your account.
                </p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${confirmLink}" 
                    style="text-decoration: none; background-color: #7861ff; color: #ffffff; padding: 12px 30px; border-radius: 50px; font-weight: bold;">
                    Confirm Email
                    </a>
                </div>

                <p style="text-align: center; font-size: 14px; color: #cccccc;">
                    Didn’t create an account? You can safely ignore this email.
                </p>

                <hr style="border-color: #333; margin: 40px 0;">

                <div style="font-size: 12px; color: #aaa; text-align: center;">
                    <p>© 2025 Taklif.AI | All rights reserved.</p>
                </div>
            </div>
        </body>
    </html>
    `,
  });
};
