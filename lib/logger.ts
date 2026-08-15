/**
 * FITMIX PRODUCTION OBSERVABILITY & ERROR MONITORING SYSTEM
 * Handles severity classification, sensitive credential redaction,
 * and integration hooks for Sentry / LogRocket / Datadog.
 */

export type ErrorSeverity = 'Warning' | 'High' | 'Critical';

export interface ErrorLogContext {
  userId?: string;
  route?: string;
  action?: string;
  metadata?: Record<string, any>;
}

// Sensitive keywords to automatically sanitize from logs
const SENSITIVE_KEYS = [
  'password',
  'secret',
  'token',
  'key',
  'authorization',
  'access_token',
  'refresh_token',
  'service_role',
  'bearer'
];

/**
 * Recursively redacts sensitive fields from objects before logging
 */
function sanitizePayload(data: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitizePayload);
  }

  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.some((s) => lowerKey.includes(s))) {
      sanitized[key] = '[REDACTED_SENSITIVE_DATA]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizePayload(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

/**
 * Formats and records an operational or runtime error
 */
export function logError(
  error: Error | string | unknown,
  severity: ErrorSeverity = 'Warning',
  context?: ErrorLogContext
) {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  const sanitizedContext = sanitizePayload(context || {});

  const logEntry = {
    timestamp,
    severity,
    message: errorMessage,
    stack,
    context: sanitizedContext,
    environment: process.env.NODE_ENV || 'production'
  };

  // 1. Console Output with Structured Severity
  if (severity === 'Critical') {
    console.error(`[CRITICAL_INCIDENT] [${timestamp}]`, logEntry);
  } else if (severity === 'High') {
    console.error(`[HIGH_PRIORITY_ERROR] [${timestamp}]`, logEntry);
  } else {
    console.warn(`[OPERATIONAL_WARNING] [${timestamp}]`, logEntry);
  }

  // 2. Sentry / External Provider Integration Hook (if installed in production)
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    (window as any).Sentry.captureException(error, {
      level: severity === 'Critical' ? 'fatal' : severity === 'High' ? 'error' : 'warning',
      extra: sanitizedContext
    });
  }
}

/**
 * Initializes global client-side unhandled error & rejection listeners
 */
export function initClientErrorMonitoring() {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    logError(event.error || event.message, 'High', {
      action: 'unhandled_window_error',
      metadata: { filename: event.filename, lineno: event.lineno, colno: event.colno }
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    logError(event.reason, 'High', {
      action: 'unhandled_promise_rejection'
    });
  });
}
