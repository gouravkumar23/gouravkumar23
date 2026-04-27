import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-template';
import { z } from "zod";
import * as React from 'react';

export const dynamic = 'force-dynamic';

const EmailSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Validate input
    const result = EmailSchema.safeParse(body);

    if (!result.success) {
      const errorMsg = result.error.errors.map(e => e.message).join(", ");
      console.error("Validation Error:", errorMsg);
      return Response.json({ error: errorMsg }, { status: 400 });
    }

    const { fullName, email, message } = result.data;

    // 2. Check API Key
    if (!process.env.RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY");
      return Response.json({ error: "Server configuration error: Missing API Key" }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // 3. Send Email
    // Note: Using 'onboarding@resend.dev' requires the 'to' address to be your Resend account email
    const { data, error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: ['gunjarigourav@gmail.com'],
      subject: `New Message from ${fullName}`,
      react: React.createElement(EmailTemplate, {
        fullName,
        email,
        message,
      }),
    });

    if (error) {
      console.error("Resend API Error:", error);
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error("Unexpected Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}