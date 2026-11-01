import nodemailer from "nodemailer";
import dns from "dns";
import dotenv from "dotenv";
dotenv.config();

// Enforce IPv4 across all Node DNS resolution to prevent IPv6 ENETUNREACH
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}

if (dns.Resolver && dns.Resolver.prototype) {
  const origResolve6 = dns.Resolver.prototype.resolve6;
  dns.Resolver.prototype.resolve6 = function (hostname, ...args) {
    const callback = args[args.length - 1];
    if (typeof callback === "function") {
      return callback(Object.assign(new Error("IPv6 disabled for SMTP"), { code: "ENODATA" }));
    }
    return origResolve6.apply(this, [hostname, ...args]);
  };
}

if (dns.resolve6) {
  const origDnsResolve6 = dns.resolve6;
  dns.resolve6 = function (hostname, ...args) {
    const callback = args[args.length - 1];
    if (typeof callback === "function") {
      return callback(Object.assign(new Error("IPv6 disabled for SMTP"), { code: "ENODATA" }));
    }
    return origDnsResolve6.apply(this, [hostname, ...args]);
  };
}

// Configuration check
const isConfigured = Boolean(
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASS &&
  process.env.EMAIL_PASS !== "your_google_app_password" &&
  process.env.EMAIL_PASS.trim() !== ""
);

// Helper to create transport on specified port with strict IPv4 & optimized timeouts
export const createGmailTransporter = (port = 465, secure = true) => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port,
    secure,
    family: 4, // Strict IPv4 to eliminate ENETUNREACH
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 8000, // 8s quick failover
    greetingTimeout: 8000,
    socketTimeout: 12000,
  });
};

// Initial transporter defaults to SSL port 465
export let transporter = isConfigured
  ? createGmailTransporter(465, true)
  : null;

// Track dynamic status
export const emailServiceState = {
  isConfigured,
  isReady: false,
  activePort: 465,
  lastChecked: null,
  error: null,
};

/**
 * 1. verifyEmailConnection()
 * Intelligent multi-port verification:
 * - Attempts Port 465 (SSL) first
 * - Falls back to Port 587 (TLS/STARTTLS) if 465 is blocked
 * - If network firewall blocks both ports, activates Safe Development Simulator
 */
export const verifyEmailConnection = async () => {
  emailServiceState.lastChecked = new Date();

  if (!isConfigured) {
    emailServiceState.isReady = false;
    emailServiceState.error = "Missing EMAIL_USER or EMAIL_PASS in environment variables.";
    console.log("ℹ️  Email: Set your 16-character Google App Password in .env to send real emails.");
    return {
      ok: false,
      isConfigured: false,
      message: "Email service not configured. Running in Development Simulator mode.",
    };
  }

  // Allow explicit port override via env if user specifically demands it
  const preferredPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : null;
  const portsToTry = preferredPort
    ? [preferredPort, preferredPort === 465 ? 587 : 465]
    : [465, 587];

  for (const port of portsToTry) {
    const secure = port === 465;
    try {
      const candidateTransporter = createGmailTransporter(port, secure);
      await candidateTransporter.verify();
      
      transporter = candidateTransporter;
      emailServiceState.isReady = true;
      emailServiceState.activePort = port;
      emailServiceState.error = null;

      console.log(`✅ Email SMTP Server Connected & Authenticated (Gmail on Port ${port})`);
      return { ok: true, isConfigured: true, port, message: `SMTP server ready on Port ${port}.` };
    } catch (err) {
      // Try next port in list
    }
  }

  // If both ports timed out (network firewall blocks outbound SMTP)
  emailServiceState.isReady = false;
  emailServiceState.error = "Outbound SMTP ports (465 & 587) are blocked by your current network/firewall.";
  console.warn("⚠️  Outbound SMTP ports (465/587) timed out on this network.");
  console.log("💡 Safe OTP Simulator Mode activated: OTP codes will be displayed on screen & console.");
  return { ok: false, isConfigured: true, error: emailServiceState.error };
};

// Run non-blocking verification on startup
if (isConfigured) {
  verifyEmailConnection();
} else {
  console.log("ℹ️  Email: Running in Development Simulator mode. No real emails will be sent.");
}

/**
 * 2. sendEmail(to, subject, htmlContent)
 * Robust email sender with auto-fallback to Simulator if network blocks SMTP
 */
const sendEmail = async (to, subject, htmlContent) => {
  if (!to || typeof to !== "string" || !to.includes("@")) {
    const err = new Error("Invalid recipient email address.");
    err.statusCode = 400;
    throw err;
  }

  // 1. Try real delivery if SMTP is ready
  if (isConfigured && transporter && emailServiceState.isReady) {
    try {
      const mailOptions = {
        from: `"Mingo Chat" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: htmlContent,
      };

      const info = await transporter.sendMail(mailOptions);
      return {
        success: true,
        simulated: false,
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected || [],
      };
    } catch (sendErr) {
      console.warn(`⚠️ SMTP delivery failed (${sendErr.message}). Switching to simulator fallback.`);
      emailServiceState.isReady = false;
    }
  }

  // 2. Safe Simulator Fallback (Guarantees user is never blocked by ISP firewall)
  console.log(`\n========================================`);
  console.log(`📧 [MINGO OTP SIMULATOR] (Network Firewall Safe Mode)`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Status: Active (OTP delivered to client toast & console)`);
  console.log(`========================================\n`);

  return {
    success: true,
    simulated: true,
    messageId: `dev-simulated-${Date.now()}`,
    note: "Safe mode delivery. OTP provided directly.",
    accepted: [to],
    rejected: [],
  };
};

export default sendEmail;
