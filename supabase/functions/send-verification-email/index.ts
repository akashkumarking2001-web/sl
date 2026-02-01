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

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { email, token, name }: EmailPayload = await req.json();

        const frontendUrl = Deno.env.get("FRONTEND_URL") || "http://localhost:5173";
        const verificationLink = `${frontendUrl}/verify-email?token=${token}`;

        const info = await transporter.sendMail({
            from: '"Ascend Academy" <no-reply@ascendacademy.com>',
            to: email,
            subject: "Verify Your Email - Ascend Academy",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Welcome to Ascend Academy! 🚀</h2>
          <p>Hi ${name},</p>
          <p>Thank you for registering. Please verify your email address to activate your account and start your journey.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="color: #666; font-size: 12px;">${verificationLink}</p>
          <p>This link will expire in 24 hours.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #999; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} Ascend Academy. All rights reserved.</p>
        </div>
      `,
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
