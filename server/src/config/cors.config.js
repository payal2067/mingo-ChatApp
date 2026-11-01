export const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:4173",
  "https://mingo-chat-app-five.vercel.app",
];

export const getAllowedOrigins = () => {
  const customOrigins = (process.env.CLIENT_URL || "")
    .split(",")
    .map((url) => url.trim().replace(/\/+$/, ""))
    .filter(Boolean);

  return [...new Set([...defaultAllowedOrigins, ...customOrigins])];
};

export const isOriginAllowed = (origin) => {
  // Allow requests with no origin (like mobile apps, curl, server-to-server)
  if (!origin) return true;

  const normalizedOrigin = origin.replace(/\/+$/, "");
  const allowed = getAllowedOrigins();

  if (allowed.includes(normalizedOrigin)) {
    return true;
  }

  // Allow any Vercel deployment (*.vercel.app)
  try {
    const parsed = new URL(normalizedOrigin);
    if (parsed.hostname.endsWith(".vercel.app")) {
      return true;
    }
  } catch {
    // invalid URL format
  }

  return false;
};

export const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
};

