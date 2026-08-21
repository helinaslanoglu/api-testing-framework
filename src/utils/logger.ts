export interface ApiDiagnosticLog {
  method: string;
  url: string;
  status: number;
  durationMs: number;
  requestHeaders?: Record<string, string>;
  requestData?: unknown;
  responseData?: unknown;
}

const SENSITIVE_HEADERS = ['authorization', 'x-api-key', 'cookie', 'set-cookie'];
const SENSITIVE_BODY_KEYS = ['password', 'accesstoken', 'refreshtoken', 'token', 'secret'];

/**
 * Sanitizes headers by redacting sensitive security keys
 */
export function sanitizeHeaders(
  headers?: Record<string, string>
): Record<string, string> | undefined {
  if (!headers) return undefined;
  const sanitized: Record<string, string> = {};

  Object.entries(headers).forEach(([key, value]) => {
    if (SENSITIVE_HEADERS.includes(key.toLowerCase())) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = value;
    }
  });

  return sanitized;
}

/**
 * Recursively sanitizes payload objects by redacting sensitive fields (passwords, tokens)
 */
export function sanitizeData(data: unknown): unknown {
  if (data === null || data === undefined) return data;
  if (typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item));
  }

  const sanitized: Record<string, unknown> = {};
  Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
    if (SENSITIVE_BODY_KEYS.includes(key.toLowerCase())) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeData(value);
    } else {
      sanitized[key] = value;
    }
  });

  return sanitized;
}

/**
 * Formats a clean, redacted diagnostic log string for API request/response cycles
 */
export function formatDiagnosticLog(log: ApiDiagnosticLog): string {
  const sanitizedHeaders = sanitizeHeaders(log.requestHeaders);
  const sanitizedReqData = sanitizeData(log.requestData);

  const lines = [
    `[API DIAGNOSTIC] ${log.method.toUpperCase()} ${log.url} - Status: ${log.status} (${log.durationMs}ms)`,
  ];

  if (sanitizedHeaders && Object.keys(sanitizedHeaders).length > 0) {
    lines.push(`  Headers: ${JSON.stringify(sanitizedHeaders)}`);
  }

  if (sanitizedReqData && Object.keys(sanitizedReqData as object).length > 0) {
    lines.push(`  Payload: ${JSON.stringify(sanitizedReqData)}`);
  }

  return lines.join('\n');
}
