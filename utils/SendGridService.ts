/* eslint-disable @typescript-eslint/no-explicit-any */
import sgMail from "@sendgrid/mail";
const SendGrid = {
  apikey: process.env.SENDGRID_API_KEY as string,
  email_sender: process.env.SENDGRID_EMAIL_SENDER as string,
};
interface EmailParams {
  email_address: string;
  otp_code: string;
}
interface ForgotParams {
  user: { [key: string]: any } | null; // Adjust the properties based on your user object structure
  otp_code: string;
}

sgMail.setApiKey(SendGrid.apikey);

export const sendRegistrationEmail = async ({
  email_address,
  otp_code,
}: EmailParams): Promise<void> => {
  const msg = {
    to: email_address,
    from: SendGrid.email_sender,
    subject: "Your OTP for Account Registration",
    html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; color: #000; }
                .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                .header { font-size: 24px; font-weight: bold; text-align: center; }
                .content { margin-top: 20px; }
                .otp { font-size: 24px; font-weight: bold; color: #097969; }
                .footer { margin-top: 20px; font-size: 14px; color: #666; text-align: center; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">Welcome to Seeking!</div>
                <div class="content">
                    <p style="color: #000">Thank you for registering with us. To complete your registration, please use the following OTP (One-Time Password):</p>
                    <p class="otp">${otp_code}</p>
                    <p style="color: #000">This OTP is valid for 30 minutes. If you did not request this registration, please ignore this email.</p>
                </div>
                <div class="footer">
                    <p>If you need help, please contact us at seeking@example.com.</p>
                    <p>Thank you,<br>Seeking</p>
                </div>
            </div>
        </body>
        </html>
        `,
  };

  try {
    const response = await sgMail.send(msg);
    console.log("SENDGRID_STATUS_CODE: ", response[0].statusCode);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email: ", error);
  }
};

export const sendChangeEmail = async ({
  email_address,
  otp_code,
}: EmailParams): Promise<void> => {
  const msg = {
    to: email_address,
    from: SendGrid.email_sender,
    subject: "Your OTP for Change Email",
    html: `
        <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; color: #000}
                    .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                    .header { font-size: 24px; font-weight: bold; text-align: center; }
                    .content { margin-top: 20px;  }
                    .otp { font-size: 24px; font-weight: bold; color: #097969; }
                    .footer { margin-top: 20px; font-size: 14px; color: #666; text-align: center; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">Change Email Request</div>
                    <div class="content">
                        <p style="color: #000">We received a request to change the email for your account. To proceed, please use the following OTP (One-Time Password):</p>
                        <p class="otp">${otp_code}</p>
                        <p style="color: #000">This OTP is valid for 30 minutes. If you did not request this password reset, please ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>If you need help, please contact us at seeking@example.com.</p>
                        <p>Thank you,<br>Seeking</p>
                    </div>
                </div>
            </body>
            </html>
        `,
  };
  try {
    const response = await sgMail.send(msg);
    console.log('Executing: sendChangeEmail')
    console.log("sendChangeEmail Status Code: ", response[0].statusCode);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email: ", error);
  }
};


export const sendForgotPassword = async ({
  user,
  otp_code,
}: ForgotParams): Promise<void> => {
  const msg = {
    to: user.email_address,
    from: SendGrid.email_sender,
    subject: "Your OTP for Change Email",
    html: `
       <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; color: #000}
                    .container { width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                    .header { font-size: 24px; font-weight: bold; text-align: center; }
                    .content { margin-top: 20px;  }
                    .otp { font-size: 24px; font-weight: bold; color: #097969; }
                    .footer { margin-top: 20px; font-size: 14px; color: #666; text-align: center; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">Password Reset Request</div>
                    <div class="content">
                        <p style="color: #000">Dear ${user.name}, We received a request to reset the password for your account. To proceed, please use the following OTP (One-Time Password):</p>
                        <p class="otp">${otp_code}</p>
                        <p style="color: #000">This OTP is valid for 1 day. If you did not request this password reset, please ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>If you need help, please contact us at seeking@example.com.</p>
                        <p>Thank you,<br>Seeking Team</p>
                    </div>
                </div>
            </body>
            </html>
        `,
  };
  try {
    const response = await sgMail.send(msg);
    console.log('Executing: sendForgotPassword')
    console.log("sendForgotPassword Status Code: ", response[0].statusCode);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email: ", error);
  }
};
