// @ts-nocheck
import { createClient } from "npm:@supabase/supabase-js@2.39.3";
import nodemailer from "npm:nodemailer@6.9.7";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailPayload {
    email: string;
    token: string;
    name: string;
    password?: string;
    userId?: string;
}

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

const transporter = nodemailer.createTransport({
    host: Deno.env.get("SMTP_HOST") || "smtp.gmail.com",
    port: parseInt(Deno.env.get("SMTP_PORT") || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
        user: Deno.env.get("SMTP_USER"),
        pass: Deno.env.get("SMTP_PASS"),
    },
});

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { email, token, name, password, userId }: EmailPayload = await req.json();

        const frontendUrl = Deno.env.get("FRONTEND_URL") || "https://skilllearnersacademy.com";
        const verificationLink = `${frontendUrl}/verify-email?token=${token}`;

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Skill Learners Academy</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f7f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
                <tr>
                    <td align="center" style="padding: 40px 0;">
                        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.05);">
                            <!-- Header Gradient -->
                            <tr>
                                <td align="center" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 60px 40px;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase;">Skill Learners</h1>
                                    <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">Academy Verification</p>
                                </td>
                            </tr>
                            
                            <!-- Main Content -->
                            <tr>
                                <td style="padding: 50px 40px; background-color: #ffffff;">
                                    <h2 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 24px; font-weight: 800;">Welcome to the Movement! 🚀</h2>
                                    <p style="color: #4b5563; line-height: 1.6; font-size: 16px; margin-bottom: 30px;">
                                        Hi <strong>${name}</strong>,<br><br>
                                        Your account at <strong>Skill Learners Academy</strong> is almost ready. We've provisioned your unique learning terminal. Please verify your identity below to unlock full access.
                                    </p>
                                    
                                    <!-- Credentials Box -->
                                    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 16px; padding: 25px; margin-bottom: 40px;">
                                        <h3 style="color: #9ca3af; font-size: 10px; font-weight: 900; text-transform: uppercase; margin: 0 0 15px 0; letter-spacing: 1px;">Academy Credentials</h3>
                                        <table width="100%">
                                            <tr>
                                                <td style="padding: 8px 0; font-size: 14px; color: #6b7280; font-weight: 600;">Account ID:</td>
                                                <td style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 800; text-align: right; font-family: monospace;">${userId || 'Not Found'}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; font-size: 14px; color: #6b7280; font-weight: 600;">Login Email:</td>
                                                <td style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 800; text-align: right;">${email}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; font-size: 14px; color: #6b7280; font-weight: 600;">Access Key:</td>
                                                <td style="padding: 8px 0; font-size: 14px; color: #111827; font-weight: 800; text-align: right; font-family: monospace;">${password || '••••••••'}</td>
                                            </tr>
                                        </table>
                                    </div>

                                    <!-- CTA Button -->
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                        <tr>
                                            <td align="center">
                                                <a href="${verificationLink}" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 20px 40px; border-radius: 16px; text-decoration: none; font-weight: 900; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 20px rgba(16,185,129,0.3);">Verify Portal Access</a>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <p style="color: #9ca3af; font-size: 12px; font-weight: 500; text-align: center; margin-top: 30px;">
                                        Link expires in 24 hours. For security, never share these details.
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="padding: 40px; background-color: #111827; text-align: center;">
                                    <p style="color: #ffffff; font-size: 14px; font-weight: 700; margin-bottom: 10px;">Skill Learners Academy</p>
                                    <p style="color: #4b5563; font-size: 12px; line-height: 1.5;">
                                        Unlocking Digital Mastery for the Future.<br>
                                        &copy; ${new Date().getFullYear()} Skill Learners Group.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `;

        const info = await transporter.sendMail({
            from: '"Skill Learners Academy" <no-reply@skilllearnersacademy.com>',
            to: email,
            subject: `Action Required: Verify Account Access - ${name}`,
            html: htmlContent,
        });

        console.log("Message sent: %s", info.messageId);

        return new Response(
            JSON.stringify({ message: "Email sent successfully", id: info.messageId }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200,
            }
        );
    } catch (error: any) {
        console.error("Error sending email:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400,
            }
        );
    }
});
