import * as React from "react";

interface EmailTemplateProps {
  fullName: string;
  email: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  fullName,
  email,
  message,
}) => (
  <div style={{ fontFamily: 'sans-serif', padding: '20px', color: '#333' }}>
    <h2 style={{ color: '#ff6400' }}>New Portfolio Message</h2>
    <p><strong>From:</strong> {fullName}</p>
    <p><strong>Email:</strong> {email}</p>
    <div style={{ background: '#f4f4f4', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
      <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{message}</p>
    </div>
    <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '30px 0' }} />
    <p style={{ fontSize: '12px', color: '#888' }}>Sent from your portfolio contact form.</p>
  </div>
);