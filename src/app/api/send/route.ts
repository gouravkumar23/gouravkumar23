import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-template';
import { z } from "zod";

export const dynamic = 'force-dynamic';

const EmailSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const result = EmailSchema.safeParse(body);

    if (!result.success) {
      return Response.json({ 
        error: result.error.errors.map(e => e.message).join(", ") 
      }, { status: 400 });
    }

    const { fullName, email, message } = result.data;

    if (!process.env.RESEND_API_KEY) {
      return Response.json({ error: "Resend API Key is missing. Please set RESEND_API_KEY in your environment variables." }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: ['gunjarigourav@gmail.com'],
      subject: `New Message from ${fullName}`,
      react: EmailTemplate({ fullName, email, message }),
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error("Email API Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}