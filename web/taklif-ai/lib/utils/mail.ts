import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "no-reply@taklif-ai.tech",
    to: email,
    subject: "2FA Code",
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
            <img src="https://develop.***REMOVED-AMPLIFY-DOMAIN***/Dark.png" alt="Taklif.AI Logo" style="width: 400px; margin-bottom: 20px;">
        </div>

        <h2 style="text-align: center; color: #ffffff;">Two-Factor Authentication</h2>
        <p style="text-align: center; color: #cccccc; margin-bottom: 30px;">
            Use the verification code below to complete your login.
        </p>

        <div style="text-align: center; margin: 30px 0;">
            <span style="background-color: #7b3ef7; color: #ffffff; padding: 15px 25px; border-radius: 5px; font-size: 20px; font-weight: bold;">
                ${token}
            </span>
        </div>

        <p style="text-align: center; font-size: 14px; color: #cccccc;">
            This code is valid for <strong>5 minutes</strong>. Do not share this code with anyone.
        </p>

        <hr style="border-color: #333; margin: 40px 0;">

        <div style="font-size: 12px; color: #aaa; text-align: center;">
            <p>If you did not request this code, please secure your account immediately.</p>
            <p>© 2025 Taklif.AI | All rights reserved.</p>
        </div>

    </div>

</body>
</html>
`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "no-reply@taklif-ai.tech",
    to: email,
    subject: "Reset your password",
    html: `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Taklif.AI - Change Password</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #1a1a1a; color: #ffffff; padding: 20px;">

    <div style="max-width: 600px; margin: auto; background-color: #252525; border-radius: 10px; padding: 30px;">

        <!-- Logo -->
        <div style="text-align: center;">
            <img src="https://develop.***REMOVED-AMPLIFY-DOMAIN***/Dark.png" alt="Taklif.AI Logo" style="width: 400px; margin-bottom: 20px;">
        </div>

        <h2 style="text-align: center; color: #ffffff;">Change Your Password</h2>
        <p style="text-align: center; color: #cccccc; margin-bottom: 30px;">
            We received a request to reset your password.<br>Click below to proceed.
        </p>

        <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="text-decoration: none; background-color: #7b3ef7; color: #ffffff; padding: 12px 30px; border-radius: 5px; font-weight: bold;">
                Reset Password
            </a>
        </div>

        <p style="text-align: center; font-size: 14px; color: #cccccc;">
            If you didn't request a password reset, please ignore this email or secure your account.
        </p>

        <hr style="border-color: #333; margin: 40px 0;">

        <div style="font-size: 12px; color: #aaa; text-align: center;">
            <p>If you need assistance, contact our support team.</p>
            <p>© 2025 Taklif.AI | All rights reserved.</p>
        </div>

    </div>

</body>
</html>

    
    `,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "no-reply@taklif-ai.tech",
    to: email,
    subject: "Verify Your Email",
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
            <img src="https://develop.***REMOVED-AMPLIFY-DOMAIN***/Dark.png" alt="Taklif.AI Logo" style="width: 400px; margin-bottom: 20px;">
        </div>

        <h2 style="text-align: center; color: #ffffff;">Email Confirmation</h2>
        <p style="text-align: center; color: #cccccc; margin-bottom: 30px;">
            Thank you for registering with <strong>Taklif.AI</strong>!<br>Please confirm your email address by clicking the button below.
        </p>

        <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmLink}" style="text-decoration: none; background-color: #7b3ef7; color: #ffffff; padding: 12px 30px; border-radius: 5px; font-weight: bold;">
                Confirm Email
            </a>
        </div>

        <p style="text-align: center; font-size: 14px; color: #cccccc;">
            If you did not create an account, please ignore this email.
        </div>

        <hr style="border-color: #333; margin: 40px 0;">

        <div style="font-size: 12px; color: #aaa; text-align: center;">
            <p>If you did not request this, please ignore this email.</p>
            <p>© 2025 Taklif.AI | All rights reserved.</p>
        </div>

</body>
</html>
    `,
  });
};
