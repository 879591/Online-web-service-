export interface SafeApiResponse<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

/**
 * Robust API fetch wrapper that:
 * 1. Checks HTTP status and Content-Type.
 * 2. Never blindly calls response.json() on HTML error pages.
 * 3. Returns structured error messages if response is non-JSON or HTML (e.g. Vercel 404).
 * 4. Gracefully unwraps { success: true, data: T } or direct JSON payloads.
 */
export async function safeApiFetch<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<SafeApiResponse<T>> {
  try {
    const res = await fetch(input, init);
    const contentType = res.headers.get('content-type') || '';

    // Check if response is JSON
    if (contentType.includes('application/json')) {
      let json: any;
      try {
        json = await res.json();
      } catch {
        return {
          ok: false,
          status: res.status,
          error: 'Malformed JSON received from API server.'
        };
      }

      if (!res.ok) {
        return {
          ok: false,
          status: res.status,
          error: json.error || json.message || `Request failed (HTTP ${res.status})`
        };
      }

      if (json.success === false) {
        return {
          ok: false,
          status: res.status,
          error: json.error || 'Server indicated an error.'
        };
      }

      // Handle both { success: true, data: T } and direct T object
      const resultData = json.data !== undefined ? json.data : json;
      return {
        ok: true,
        status: res.status,
        data: resultData as T
      };
    }

    // Response is NOT JSON (e.g. Vercel 404 HTML, gateway timeout, etc.)
    const text = await res.text();
    let errorMessage = `Server returned non-JSON response (HTTP ${res.status}).`;

    if (res.status === 404) {
      errorMessage = 'The API route was not found (HTTP 404). Please ensure backend serverless functions are configured.';
    } else if (res.status >= 500) {
      errorMessage = `Server temporary error (HTTP ${res.status}). Please try again in a moment.`;
    } else if (text && text.length < 120 && !text.includes('<html')) {
      errorMessage = text.trim();
    }

    return {
      ok: false,
      status: res.status,
      error: errorMessage
    };
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      error: err?.message || 'Network connection error. Please check your connectivity.'
    };
  }
}
