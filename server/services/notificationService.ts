import { Order } from '../../src/types/index.ts';

interface NotificationResult {
  status: 'SENT' | 'FAILED' | 'NOT_CONFIGURED';
  messageId?: string;
  error?: string;
}

// Clean phone number into E.164 international format (+91XXXXXXXXXX)
export function formatPhoneForE164(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 11 && digits.startsWith('0')) return `+91${digits.slice(1)}`;
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
  if (phone.startsWith('+')) return phone;
  return `+${digits}`;
}

/**
 * Send real transactional order confirmation email via Resend API
 */
export async function sendOrderConfirmationEmail(order: Order, appUrl?: string): Promise<NotificationResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return {
      status: 'NOT_CONFIGURED',
      error: 'RESEND_API_KEY environment variable is not configured.'
    };
  }

  const fromEmail = process.env.EMAIL_FROM || 'Online Website & Digital Services <onboarding@resend.dev>';
  const baseUrl = (appUrl || process.env.APP_URL || 'https://onlinewebsite.vercel.app').replace(/\/$/, '');
  const trackUrl = `${baseUrl}/?track=${order.id}`;

  const textBody = `Dear ${order.clientName},

Thank you for placing your order with Online Website & Digital Services.

Your order has been successfully received.

ORDER DETAILS
Order ID: ${order.id}
Service: ${order.serviceName}
Package: ${order.packageName}
Business/Brand: ${order.brandName || 'N/A'}
Project Description: ${order.projectDescription}
Budget: ${order.price || order.budget}
Deadline: ${order.deadline}
Order Status: ${order.status}
Payment Status: ${order.paymentStatus === 'Verified' ? 'VERIFIED' : 'PAYMENT PENDING'}
Customer Email: ${order.email}
Customer Mobile: ${order.whatsapp}
Order Date: ${new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

Track My Order:
${trackUrl}

Thank you for choosing Online Website & Digital Services.
Owner: Suraj Maurya
WhatsApp: 919792006815
Email: 5tarsurajsdr@gmail.com`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b1120; color: #f8fafc; padding: 24px; margin: 0; }
    .card { max-width: 600px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #0ea5e9, #2563eb); padding: 28px 24px; text-align: center; color: white; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 6px 0 0 0; font-size: 13px; opacity: 0.9; }
    .content { padding: 28px 24px; }
    .highlight-box { background: #1e293b; border-radius: 12px; padding: 18px; margin: 20px 0; border-left: 4px solid #38bdf8; }
    .order-id { font-size: 22px; font-weight: 800; color: #facc15; font-family: monospace; letter-spacing: 1px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
    td { padding: 10px 0; border-bottom: 1px solid #334155; }
    td.label { color: #94a3b8; font-weight: 600; width: 40%; }
    td.val { color: #f8fafc; font-weight: 500; text-align: right; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .badge-pending { background: #78350f; color: #fef08a; }
    .btn { display: block; text-align: center; background: #0284c7; color: #ffffff !important; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; margin-top: 24px; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #64748b; border-top: 1px solid #1e293b; background: #090e17; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>ONLINE WEBSITE & DIGITAL SERVICES</h1>
      <p>Suraj Maurya — Your Vision &rarr; Our Digital Solution</p>
    </div>
    <div class="content">
      <p style="font-size: 15px; margin-top: 0;">Dear <strong>${order.clientName}</strong>,</p>
      <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
        Thank you for placing your order with Online Website & Digital Services. Your project order has been received successfully!
      </p>

      <div class="highlight-box">
        <div style="font-size: 11px; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px;">Tracking Order ID</div>
        <div class="order-id">${order.id}</div>
      </div>

      <table>
        <tr><td class="label">Service</td><td class="val">${order.serviceName}</td></tr>
        <tr><td class="label">Package</td><td class="val">${order.packageName}</td></tr>
        <tr><td class="label">Business/Brand</td><td class="val">${order.brandName || 'Individual'}</td></tr>
        <tr><td class="label">Project Scope</td><td class="val" style="max-width: 250px; word-break: break-word;">${order.projectDescription}</td></tr>
        <tr><td class="label">Budget / Price</td><td class="val" style="color: #38bdf8; font-weight: 700;">${order.price || order.budget}</td></tr>
        <tr><td class="label">Target Deadline</td><td class="val">${order.deadline}</td></tr>
        <tr><td class="label">Order Status</td><td class="val"><span class="badge" style="background: #1e3a8a; color: #93c5fd;">${order.status}</span></td></tr>
        <tr><td class="label">Payment Status</td><td class="val"><span class="badge badge-pending">${order.paymentStatus === 'Verified' ? 'VERIFIED' : 'PAYMENT PENDING'}</span></td></tr>
      </table>

      <a href="${trackUrl}" class="btn">Track Order Progress Live</a>
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px 0;">Thank you for choosing <strong>Online Website & Digital Services</strong>.</p>
      <p style="margin: 0;">WhatsApp: +91 9792006815 &bull; Email: 5tarsurajsdr@gmail.com</p>
    </div>
  </div>
</body>
</html>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [order.email],
        subject: `Order Confirmed — ${order.id} | Online Website & Digital Services`,
        html: htmlBody,
        text: textBody
      })
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data.id) {
      return {
        status: 'SENT',
        messageId: data.id
      };
    }

    return {
      status: 'FAILED',
      error: data.message || `Resend API returned HTTP ${res.status}`
    };
  } catch (err: any) {
    return {
      status: 'FAILED',
      error: err?.message || 'Network exception during Resend API request'
    };
  }
}

/**
 * Send real SMS notification to customer via Twilio Messages API
 */
export async function sendOrderConfirmationSMS(order: Order, appUrl?: string): Promise<NotificationResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromPhone) {
    return {
      status: 'NOT_CONFIGURED',
      error: 'Twilio SMS credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER) are not configured.'
    };
  }

  const toPhone = formatPhoneForE164(order.whatsapp);
  if (!toPhone) {
    return {
      status: 'FAILED',
      error: 'Invalid customer phone number format.'
    };
  }

  const baseUrl = (appUrl || process.env.APP_URL || 'https://onlinewebsite.vercel.app').replace(/\/$/, '');
  const trackUrl = `${baseUrl}/?track=${order.id}`;

  const messageBody = `Order Confirmed! Thank you ${order.clientName}. Your order ${order.id} for ${order.serviceName} has been received. Amount: ${order.price || order.budget}. Payment: Pending. Track: ${trackUrl} - Online Website & Digital Services`;

  try {
    const authHeader = Buffer.from(`${accountSid.trim()}:${authToken.trim()}`).toString('base64');
    const params = new URLSearchParams({
      To: toPhone,
      From: fromPhone.trim(),
      Body: messageBody
    });

    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid.trim()}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data.sid) {
      return {
        status: 'SENT',
        messageId: data.sid
      };
    }

    return {
      status: 'FAILED',
      error: data.message || `Twilio SMS returned HTTP ${res.status}`
    };
  } catch (err: any) {
    return {
      status: 'FAILED',
      error: err?.message || 'Network exception during Twilio SMS request'
    };
  }
}

// In-memory rate limiting and cooldown store for Admin OTP
interface OtpRateLimit {
  lastSentAt: number;
  attempts: number;
  windowStart: number;
}
const otpRateLimits = new Map<string, OtpRateLimit>();

const COOLDOWN_MS = 30 * 1000; // 30 seconds cooldown between OTP sends
const MAX_ATTEMPTS = 5; // Max 5 requests per 10-minute window
const WINDOW_MS = 10 * 60 * 1000;

/**
 * Send real SMS OTP to Admin using Twilio Verify API
 */
export async function sendAdminVerifyOtp(phone: string): Promise<{ success: boolean; status?: string; sid?: string; error?: string }> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  if (!accountSid || !authToken || !serviceSid) {
    return {
      success: false,
      error: 'SMS OTP is not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_VERIFY_SERVICE_SID in server environment variables.'
    };
  }

  const toPhone = formatPhoneForE164(phone);
  if (!toPhone) {
    return {
      success: false,
      error: 'Invalid admin phone number format.'
    };
  }

  // Rate Limiting & Cooldown Check
  const now = Date.now();
  const rl = otpRateLimits.get(toPhone) || { lastSentAt: 0, attempts: 0, windowStart: now };

  if (now - rl.windowStart > WINDOW_MS) {
    rl.attempts = 0;
    rl.windowStart = now;
  }

  if (now - rl.lastSentAt < COOLDOWN_MS) {
    const waitSec = Math.ceil((COOLDOWN_MS - (now - rl.lastSentAt)) / 1000);
    return {
      success: false,
      error: `Please wait ${waitSec} seconds before requesting a new OTP.`
    };
  }

  if (rl.attempts >= MAX_ATTEMPTS) {
    return {
      success: false,
      error: 'Maximum OTP attempts reached. Please try again after 10 minutes.'
    };
  }

  try {
    const authHeader = Buffer.from(`${accountSid.trim()}:${authToken.trim()}`).toString('base64');
    const params = new URLSearchParams({
      To: toPhone,
      Channel: 'sms'
    });

    const res = await fetch(`https://verify.twilio.com/v2/Services/${serviceSid.trim()}/Verifications`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data.status) {
      rl.lastSentAt = now;
      rl.attempts += 1;
      otpRateLimits.set(toPhone, rl);

      return {
        success: true,
        status: data.status,
        sid: data.sid
      };
    }

    return {
      success: false,
      error: data.message || `Twilio Verify error (HTTP ${res.status})`
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Twilio Verify network failure'
    };
  }
}

/**
 * Check admin OTP code via Twilio Verify API
 */
export async function checkAdminVerifyOtp(phone: string, code: string): Promise<{ success: boolean; valid: boolean; error?: string }> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  if (!accountSid || !authToken || !serviceSid) {
    return {
      success: false,
      valid: false,
      error: 'SMS OTP is not configured.'
    };
  }

  const toPhone = formatPhoneForE164(phone);
  if (!toPhone) {
    return {
      success: false,
      valid: false,
      error: 'Invalid admin phone format.'
    };
  }

  try {
    const authHeader = Buffer.from(`${accountSid.trim()}:${authToken.trim()}`).toString('base64');
    const params = new URLSearchParams({
      To: toPhone,
      Code: code.trim()
    });

    const res = await fetch(`https://verify.twilio.com/v2/Services/${serviceSid.trim()}/VerificationCheck`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && (data.status === 'approved' || data.valid === true)) {
      return {
        success: true,
        valid: true
      };
    }

    return {
      success: true,
      valid: false,
      error: data.message || 'Invalid or expired OTP code entered.'
    };
  } catch (err: any) {
    return {
      success: false,
      valid: false,
      error: err?.message || 'Failed to verify OTP with Twilio'
    };
  }
}
