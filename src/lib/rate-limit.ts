/**
 * Rate Limiter Utility
 * Prevents spam by limiting requests per IP address
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
  firstAttempt: number;
}

// In-memory store (for Edge/Serverless environments)
// Note: This resets on cold starts, but provides basic protection
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration Types
export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  blockDurationMs: number;
  maxRequestsPerDay: number;
  dayMs: number;
}

// Default Configuration (Email Form)
const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  maxRequests: 1,
  windowMs: 5 * 60 * 1000,
  blockDurationMs: 15 * 60 * 1000,
  maxRequestsPerDay: 5,
  dayMs: 24 * 60 * 60 * 1000,
};

export const CHAT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
  blockDurationMs: 5 * 60 * 1000, // 5 minutes block
  maxRequestsPerDay: 50,
  dayMs: 24 * 60 * 60 * 1000,
};

export const CERT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDurationMs: 60 * 60 * 1000, // 1 hour block
  maxRequestsPerDay: 20,
  dayMs: 24 * 60 * 60 * 1000,
};

/**
 * Check if IP is rate limited
 * @param identifier - IP address or unique identifier
 * @param config - Rate limit configuration
 * @returns {object} - { allowed: boolean, resetTime?: number }
 */
export function checkRateLimit(identifier: string, config: RateLimitConfig = DEFAULT_RATE_LIMIT_CONFIG): {
  allowed: boolean;
  resetTime?: number;
  remainingAttempts?: number;
  message?: string;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // Clean up old entries (garbage collection)
  cleanupOldEntries(now, config);

  // No previous attempts
  if (!entry) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs,
      firstAttempt: now,
    });
    return {
      allowed: true,
      remainingAttempts: config.maxRequests - 1,
    };
  }

  // Check if currently blocked
  if (entry.count > config.maxRequests && now < entry.resetTime) {
    const remainingTime = Math.ceil((entry.resetTime - now) / 1000 / 60);
    return {
      allowed: false,
      resetTime: entry.resetTime,
      message: `Terlalu banyak percobaan. Silakan coba lagi dalam ${remainingTime} menit.`,
    };
  }

  // Check daily limit
  const timeSinceFirst = now - entry.firstAttempt;
  if (timeSinceFirst < config.dayMs) {
    if (entry.count >= config.maxRequestsPerDay) {
      return {
        allowed: false,
        resetTime: entry.firstAttempt + config.dayMs,
        message: 'Anda telah mencapai batas pengiriman harian. Silakan coba lagi besok.',
      };
    }
  } else {
    // Reset daily counter
    entry.firstAttempt = now;
    entry.count = 0;
  }

  // Reset window if expired
  if (now >= entry.resetTime) {
    entry.count = 1;
    entry.resetTime = now + config.windowMs;
    rateLimitStore.set(identifier, entry);
    return {
      allowed: true,
      remainingAttempts: config.maxRequests - 1,
    };
  }

  // Increment counter
  entry.count += 1;

  // Check if limit exceeded
  if (entry.count > config.maxRequests) {
    // Block for extended period
    entry.resetTime = now + config.blockDurationMs;
    rateLimitStore.set(identifier, entry);
    
    const remainingTime = Math.ceil(config.blockDurationMs / 1000 / 60);
    return {
      allowed: false,
      resetTime: entry.resetTime,
      message: `Terlalu banyak percobaan. Anda diblokir selama ${remainingTime} menit.`,
    };
  }

  // Still within limit
  rateLimitStore.set(identifier, entry);
  return {
    allowed: true,
    remainingAttempts: config.maxRequests - entry.count,
  };
}

/**
 * Get client IP address from request
 * @param request - Next.js request object
 * @returns IP address string
 */
export function getClientIdentifier(request: Request): string {
  // Try multiple headers (Vercel, Cloudflare, etc.)
  const headers = request.headers;
  
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback
  return 'unknown';
}

/**
 * Clean up expired entries from rate limit store
 * @param now - Current timestamp
 */
function cleanupOldEntries(now: number, config: RateLimitConfig): void {
  const entriesToDelete: string[] = [];
  
  rateLimitStore.forEach((entry, key) => {
    // Remove entries older than 24 hours
    if (now - entry.firstAttempt > config.dayMs) {
      entriesToDelete.push(key);
    }
  });

  entriesToDelete.forEach(key => rateLimitStore.delete(key));
}

/**
 * Additional content-based spam detection
 * @param content - Message content to check
 * @returns true if spam detected
 */
export function detectSpamContent(content: {
  name: string;
  email: string;
  message: string;
}): boolean {
  const { name, email, message } = content;

  // Check for extremely short messages
  if (message.length < 10) {
    return true;
  }

  // Check for excessive length (potential attack)
  if (message.length > 5000 || name.length > 100 || email.length > 100) {
    return true;
  }

  // Common spam patterns (case-insensitive)
  const spamPatterns = [
    /viagra/i,
    /casino/i,
    /lottery/i,
    /prize.*won/i,
    /click.*here/i,
    /buy.*now/i,
    /limited.*offer/i,
    /act.*now/i,
    /free.*money/i,
    /bitcoin.*investment/i,
    /crypto.*profit/i,
  ];

  const combinedText = `${name} ${email} ${message}`.toLowerCase();
  
  for (const pattern of spamPatterns) {
    if (pattern.test(combinedText)) {
      return true;
    }
  }

  // Check for excessive URLs
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const urls = combinedText.match(urlPattern) || [];
  if (urls.length > 3) {
    return true;
  }

  // Check for repeated characters (e.g., "aaaaaa", "111111")
  const repeatedChars = /(.)\1{10,}/;
  if (repeatedChars.test(message)) {
    return true;
  }

  return false;
}

/**
 * Validate email with additional checks
 * @param email - Email address to validate
 * @returns true if valid
 */
export function validateEmail(email: string): boolean {
  // Basic regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }

  // Block disposable email domains
  const disposableDomains = [
    'tempmail.com',
    'throwaway.email',
    'guerrillamail.com',
    'mailinator.com',
    '10minutemail.com',
    'trashmail.com',
    'maildrop.cc',
  ];

  const domain = email.split('@')[1]?.toLowerCase();
  if (disposableDomains.includes(domain)) {
    return false;
  }

  return true;
}
