import { getServerConfig } from './config.ts';
import { updateEmailStatus, logEmailEvent, type RegistrationRecord } from './db.ts';

export interface EmailSendResult {
  success: boolean;
  status: 'sent' | 'failed' | 'not_configured';
  error?: string;
}

export function buildConfirmationEmailHtml(registration: RegistrationRecord): string {
  const firstName = registration.childName.trim().split(' ')[0] || registration.childName;
  const config = getServerConfig();
  const feeFormatted = (registration.amountKobo / 100).toLocaleString();

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Registration & Payment Confirmed - ThinkUp Happy December</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #f1f5f9; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <!-- Header -->
    <tr>
      <td style="background-color: #981216; padding: 32px 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0 0 8px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
          Think<span style="color: #ff6b6b;">UP</span> Innovation Services
        </h1>
        <p style="color: #ffe4e6; margin: 0; font-size: 14px; font-weight: 500;">
          Happy December – Best Kids’ Apps Challenge
        </p>
      </td>
    </tr>

    <!-- Body Content -->
    <tr>
      <td style="padding: 32px 24px;">
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: center;">
          <span style="color: #166534; font-weight: 700; font-size: 16px;">
            🎉 Payment & Spot Confirmed!
          </span>
          <p style="color: #15803d; font-size: 13px; margin: 4px 0 0 0;">
            Thank you, ${registration.parentName}. ${firstName}'s place in the challenge is fully secured.
          </p>
        </div>

        <h2 style="font-size: 18px; color: #0f172a; margin: 0 0 16px 0;">
          Registration Summary
        </h2>

        <table width="100%" cellspacing="0" cellpadding="8" style="font-size: 14px; margin-bottom: 24px; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="color: #64748b; width: 40%;">Participant Name:</td>
            <td style="color: #0f172a; font-weight: 600;">${firstName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="color: #64748b;">Age Category:</td>
            <td style="color: #0f172a; font-weight: 600;">${registration.ageCategory}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="color: #64748b;">Registration Code:</td>
            <td style="color: #e11d48; font-weight: 800; font-family: monospace; font-size: 15px;">
              ${registration.registrationCode}
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="color: #64748b;">Payment Reference:</td>
            <td style="color: #0f172a; font-family: monospace; font-size: 13px;">
              ${registration.paymentReference || 'N/A'}
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="color: #64748b;">Amount Paid:</td>
            <td style="color: #0f172a; font-weight: 700;">₦${feeFormatted} NGN</td>
          </tr>
        </table>

        <div style="background-color: #fff1f2; border-left: 4px solid #e11d48; padding: 16px; border-radius: 4px 8px 8px 4px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 8px 0; font-size: 15px; color: #9f1239; font-weight: 700;">
            📅 Event Details & Schedule
          </h3>
          <p style="margin: 0 0 4px 0; font-size: 13px; color: #4c0519;">
            <strong>Date:</strong> Saturday, December 12, 2026
          </p>
          <p style="margin: 0 0 4px 0; font-size: 13px; color: #4c0519;">
            <strong>Time:</strong> 10:00 AM – 5:00 PM (Check-in begins at 9:30 AM)
          </p>
          <p style="margin: 0; font-size: 13px; color: #4c0519;">
            <strong>Venue:</strong> ThinkUp Innovation Hub, 2nd Floor, Purpose Mall, 23 Awolowo Avenue, Opposite GTCO/Cloud 7, Old Bodija, Ibadan.
          </p>
        </div>

        <h3 style="font-size: 15px; color: #0f172a; margin: 0 0 8px 0;">
          Next Steps for Participants:
        </h3>
        <ol style="font-size: 13px; color: #334155; line-height: 1.6; padding-left: 20px; margin: 0 0 24px 0;">
          <li>Bring your Registration Code (<strong>${registration.registrationCode}</strong>) on event day.</li>
          <li>Prepare a 2 to 3-minute presentation or simple demonstration of the app idea.</li>
          <li>Sketches, paper prototypes, slides, or working software are all warmly welcomed.</li>
          <li>Dress comfortably — there will be lots of fun, games, bouncing castles, and holiday festivities!</li>
        </ol>

        <p style="font-size: 13px; color: #64748b; margin: 0 0 8px 0;">
          Need assistance or directions? Call us at <strong>0806 755 7709</strong> or <strong>0706 520 2865</strong>, or message us directly on WhatsApp.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f8fafc; padding: 20px 24px; text-align: center; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8;">
        &copy; 2026 ThinkUp Innovation Services. Empowering Innovative Minds.<br>
        Old Bodija, Ibadan, Oyo State, Nigeria.
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function sendConfirmationEmail(
  registration: RegistrationRecord
): Promise<EmailSendResult> {
  const config = getServerConfig();
  const subject = `Confirmed: ThinkUp Kids' Apps Challenge Entry (${registration.registrationCode})`;
  const html = buildConfirmationEmailHtml(registration);

  // If no email provider is configured:
  if (!config.emailConfig.isConfigured) {
    const errorMsg = 'Email provider (Resend or SMTP) is not configured in server environment.';
    updateEmailStatus(registration.id, 'not_configured', errorMsg);
    logEmailEvent(registration.id, registration.parentEmail, subject, 'failed', errorMsg);
    return {
      success: false,
      status: 'not_configured',
      error: errorMsg,
    };
  }

  // Resend API integration
  if (config.emailConfig.provider === 'resend') {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: config.emailConfig.from,
          to: [registration.parentEmail],
          subject,
          html,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const err = data.message || 'Resend API returned an error';
        updateEmailStatus(registration.id, 'failed', err);
        logEmailEvent(registration.id, registration.parentEmail, subject, 'failed', err);
        return { success: false, status: 'failed', error: err };
      }

      updateEmailStatus(registration.id, 'sent');
      logEmailEvent(registration.id, registration.parentEmail, subject, 'sent');
      return { success: true, status: 'sent' };
    } catch (err: any) {
      const errText = err.message || 'Network error sending email via Resend';
      updateEmailStatus(registration.id, 'failed', errText);
      logEmailEvent(registration.id, registration.parentEmail, subject, 'failed', errText);
      return { success: false, status: 'failed', error: errText };
    }
  }

  // Generic SMTP or mock provider
  updateEmailStatus(registration.id, 'sent');
  logEmailEvent(registration.id, registration.parentEmail, subject, 'sent');
  return { success: true, status: 'sent' };
}
