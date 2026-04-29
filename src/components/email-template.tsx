interface EmailTemplateProps {
  fullName: string;
  email: string;
  message: string;
}

export const getEmailHtml = ({ fullName, email, message }: EmailTemplateProps) => `
  <div style="font-family: sans-serif; padding: 20px; color: #333;">
    <h2 style="color: #ff6400;">New Portfolio Message</h2>
    <p><strong>From:</strong> ${fullName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin-top: 20px;">
      <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
    </div>
    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
    <p style="font-size: 12px; color: #888;">Sent from your portfolio contact form.</p>
  </div>
`;