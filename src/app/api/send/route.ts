import { z } from "zod";

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

    // Using the Render mailing service API
    const response = await fetch("https://qwertymailingservice.onrender.com/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.MAILING_SERVICE_API_KEY || "YOUR_SERVICE_API_KEY",
      },
      body: JSON.stringify({
        to: ["gunjarigourav@gmail.com"],
        subject: `Portfolio Contact: ${fullName}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
            <h2 style="color: #ff6400; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Portfolio Message</h2>
            <p><strong>From:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
              <p style="white-space: pre-wrap; line-height: 1.6; color: #333;">${message}</p>
            </div>
            <p style="font-size: 12px; color: #888; margin-top: 30px;">Sent from your portfolio contact form.</p>
          </div>
        `,
        from: {
          name: "Portfolio Contact"
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return Response.json({ 
        error: errorData.message || "Mailing service error" 
      }, { status: response.status });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Email API Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}