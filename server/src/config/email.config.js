import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config(); // ESM hoisting fix: ensure env vars loaded before this module initializes

// Configuration check
const isConfigured = Boolean(
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASS &&
  process.env.EMAIL_PASS !== "your_google_app_password" &&
  process.env.EMAIL_PASS.trim() !== ""
);

// Transporter instance
export const transporter = isConfigured
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Timeout settings to avoid hung connections
      connectionTimeout: 10000, // 10s
      greetingTimeout: 10000,
      socketTimeout: 15000,
    })
  : null;

// Track dynamic status
export const emailServiceState = {
  isConfigured,
  isReady: false,
  lastChecked: null,
  error: null,
};

/**
 * 1. transporter.verify()
 * Verifies SMTP authentication and server reachability.
 * NOTE: This tests connectivity to Gmail's SMTP server; it does NOT guarantee
 * delivery to individual recipient inboxes (spam filters, inbox quotas, etc.).
 */
export const verifyEmailConnection = async () => {
  emailServiceState.lastChecked = new Date();

  if (!isConfigured || !transporter) {
    emailServiceState.isReady = false;
    emailServiceState.error = "Missing EMAIL_USER or EMAIL_PASS in environment variables.";
    console.log("ℹ️ Email: Set your 16-character Google App Password in .env to send real emails.");
    return {
      ok: false,
      isConfigured: false,
      message: "Email service not configured. Running in Development Simulator mode.",
    };
  }

  try {
    await transporter.verify();
    emailServiceState.isReady = true;
    emailServiceState.error = null;
    console.log("✅ Email SMTP Server Connected & Authenticated (Gmail)");
    return { ok: true, isConfigured: true, message: "SMTP server ready." };
  } catch (error) {
    emailServiceState.isReady = false;
    emailServiceState.error = error.message;
    console.error("❌ Email SMTP Verification Failed:", error.message);
    return { ok: false, isConfigured: true, error: error.message };
  }
};

// Run verification on module load if configured
if (isConfigured) {
  verifyEmailConnection();
} else {
  console.log("ℹ️  Email: Running in Development Simulator mode. No real emails will be sent.");
}

/**
 * 2. sendEmail(to, subject, htmlContent)
 * Robust email sender with:
 * - Proper Dev Email Simulator differentiation (dev vs production)
 * - Standardized return value { success, messageId, simulated, accepted, rejected }
 * - Specific error code mapping with HTTP status codes for callers
 */
const sendEmail = async (to, subject, htmlContent) => {
  // Validate recipient
  if (!to || typeof to !== "string" || !to.includes("@")) {
    const err = new Error("Invalid recipient email address.");
    err.statusCode = 400;
    throw err;
  }

  // Handle unconfigured state
  if (!isConfigured || !transporter) {
    // In Production: Do NOT fake success; fail explicitly
    if (process.env.NODE_ENV === "production") {
      const err = new Error("Email delivery service is not configured on the production server.");
      err.statusCode = 503;
      throw err;
    }

    // In Development: Explicitly log simulation in terminal & return simulated result
    console.log(`\n========================================`);
    console.log(`📧 [DEV EMAIL SIMULATOR] (No real email sent)`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Status: SIMULATED (To send actual emails, add Google App Password in .env)`);
    console.log(`========================================\n`);

    return {
      success: true,
      simulated: true,
      messageId: `dev-simulated-${Date.now()}`,
      note: "Email simulated in development mode. No actual email was dispatched.",
      accepted: [to],
      rejected: [],
    };
  }

  // 3. Real SMTP Sending with categorized error handling
  try {
    const mailOptions = {
      from: `"Mingo Chat" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);

    // Check if recipient was rejected by server
    if (info.rejected && info.rejected.length > 0) {
      const err = new Error(`Email rejected for recipient: ${info.rejected.join(", ")}`);
      err.statusCode = 400;
      throw err;
    }

    return {
      success: true,
      simulated: false,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected || [],
    };
  } catch (error) {
    console.error("❌ SMTP Delivery Error:", error.message);

    // Map common SMTP errors to user-friendly operational errors
    let userError;
    if (error.code === "EAUTH") {
      userError = new Error("Email server authentication failed. Please check EMAIL_USER and EMAIL_PASS.");
      userError.statusCode = 500;
    } else if (error.code === "ETIMEDOUT" || error.code === "ESOCKET" || error.code === "ECONNREFUSED") {
      userError = new Error("Email service connection timed out. Please try again in a few moments.");
      userError.statusCode = 503;
    } else if (error.responseCode && error.responseCode >= 500) {
      userError = new Error("Recipient mail server rejected the email.");
      userError.statusCode = 400;
    } else {
      userError = new Error(error.message || "Failed to deliver email.");
      userError.statusCode = error.statusCode || 500;
    }

    userError.originalCode = error.code;
    throw userError;
  }
};

export default sendEmail;