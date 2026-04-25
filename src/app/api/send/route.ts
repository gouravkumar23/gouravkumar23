import { z } from "zod";

const EmailSchema = z.object({
  fullName: z.string().min(2, "Full name is invalid!"),
  email: z.string().email({ message: "Email is invalid!" }),
  message: z.string().min(10, "Message is too short!"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const {
      success: zodSuccess,
      data: zodData,
      error: zodError,
    } = EmailSchema.safeParse(body);

    if (!zodSuccess) {
      return Response.json({ error: zodError?.message }, { status: 400 });
    }

    const response = await fetch("https://qwertymailingservice.onrender.com/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.MAILING_SERVICE_API_KEY || "YOUR_SERVICE_API_KEY_PLACEHOLDER",
      },
      body: JSON.stringify({
        to: ["gunjarigourav@gmail.com"],
        subject: `Portfolio Contact: ${zodData.fullName}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #333;">New Message from Portfolio</h2>
            <p><strong>From:</strong> ${zodData.fullName} (${zodData.email})</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="white-space: pre-wrap; line-height: 1.6;">${zodData.message}</p>
          </div>
        `,
        from: {
          name: "Portfolio Contact Form"
        }
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return Response.json({ error: result.message || "Failed to send email" }, { status: response.status });
    }

    return Response.json({ success: true, data: result });
  } catch (error) {
    console.error("Email API Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}