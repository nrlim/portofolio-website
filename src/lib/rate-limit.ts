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

// Configuration
const RATE_LIMIT_CONFIG = {
  // Maximum requests allowed in the time window
  maxRequests: 1,
  
  // Time window in milliseconds (5 minutes)
  windowMs: 5 * 60 * 1000,
  
  // Block duration after exceeding limit (15 minutes)
  blockDurationMs: 15 * 60 * 1000,
  
  // Maximum requests per day from same IP
  maxRequestsPerDay: 5,
  
  // 24 hours in milliseconds
  dayMs: 24 * 60 * 60 * 1000,
};

/**
 * Check if IP is rate limited
 * @param identifier - IP address or unique identifier
 * @returns {object} - { allowed: boolean, resetTime?: number }
 */
export function checkRateLimit(identifier: string): {
  allowed: boolean;
  resetTime?: number;
  remainingAttempts?: number;
  message?: string;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // Clean up old entries (garbage collection)
  cleanupOldEntries(now);

  // No previous attempts
  if (!entry) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
      firstAttempt: now,
    });
    return {
      allowed: true,
      remainingAttempts: RATE_LIMIT_CONFIG.maxRequests - 1,
    };
  }

  // Check if currently blocked
  if (entry.count > RATE_LIMIT_CONFIG.maxRequests && now < entry.resetTime) {
    const remainingTime = Math.ceil((entry.resetTime - now) / 1000 / 60);
    return {
      allowed: false,
      resetTime: entry.resetTime,
      message: `Terlalu banyak percobaan. Silakan coba lagi dalam ${remainingTime} menit.`,
    };
  }

  // Check daily limit
  const timeSinceFirst = now - entry.firstAttempt;
  if (timeSinceFirst < RATE_LIMIT_CONFIG.dayMs) {
    if (entry.count >= RATE_LIMIT_CONFIG.maxRequestsPerDay) {
      return {
        allowed: false,
        resetTime: entry.firstAttempt + RATE_LIMIT_CONFIG.dayMs,
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
    entry.resetTime = now + RATE_LIMIT_CONFIG.windowMs;
    rateLimitStore.set(identifier, entry);
    return {
      allowed: true,
      remainingAttempts: RATE_LIMIT_CONFIG.maxRequests - 1,
    };
  }

  // Increment counter
  entry.count += 1;

  // Check if limit exceeded
  if (entry.count > RATE_LIMIT_CONFIG.maxRequests) {
    // Block for extended period
    entry.resetTime = now + RATE_LIMIT_CONFIG.blockDurationMs;
    rateLimitStore.set(identifier, entry);
    
    const remainingTime = Math.ceil(RATE_LIMIT_CONFIG.blockDurationMs / 1000 / 60);
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
    remainingAttempts: RATE_LIMIT_CONFIG.maxRequests - entry.count,
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
function cleanupOldEntries(now: number): void {
  const entriesToDelete: string[] = [];
  
  rateLimitStore.forEach((entry, key) => {
    // Remove entries older than 24 hours
    if (now - entry.firstAttempt > RATE_LIMIT_CONFIG.dayMs) {
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
