import { getEmailHtml } from '@/components/email-template';
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
    
    // 1. Validate input
    const result = EmailSchema.safeParse(body);

    if (!result.success) {
      const errorMsg = result.error.errors.map(e => e.message).join(", ");
      return Response.json({ error: errorMsg }, { status: 400 });
    }

    const { fullName, email, message } = result.data;

    // 2. Check API Key
    const apiKey = process.env.MAILING_SERVICE_API_KEY;
    if (!apiKey) {
      console.error("Missing MAILING_SERVICE_API_KEY");
      return Response.json({ error: "Server configuration error: Missing API Key" }, { status: 500 });
    }

    // 3. Generate HTML string
    const htmlContent = getEmailHtml({
      fullName,
      email,
      message,
    });

    // 4. Send to Custom Mailing Service using minimum required parameters
    const response = await fetch("https://qwertymailingservice.onrender.com/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        to: ["gunjarigourav@gmail.com"],
        subject: `New Portfolio Message from ${fullName}`,
        html: htmlContent,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Mailing Service Error:", data);
      return Response.json({ error: data.message || "Failed to send email" }, { status: response.status });
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error("Unexpected Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}