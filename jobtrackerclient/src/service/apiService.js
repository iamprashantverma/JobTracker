const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(path, options = {}) {
  const url = `${API_URL}${path}`;
  const resp = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  // Try to parse envelope regardless of status
  let envelope;
  try {
    envelope = await resp.json();
  } catch {
    envelope = null;
  }

  // Expected envelope: { timeStamp, data, error }
  if (!resp.ok) {
    const normalized = normalizeError(envelope?.error, resp.status);
    const err = new Error(normalized.primaryMessage);
    err.details = normalized;
    throw err;
  }

  if (envelope && ("data" in envelope || "error" in envelope)) {
    if (envelope.error) {
      const normalized = normalizeError(envelope.error, resp.status);
      const err = new Error(normalized.primaryMessage);
      err.details = normalized;
      throw err;
    }
    return envelope.data;
  }

 
  return envelope;
}

export const signUp = async (data) => {
  return apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const login = async (data) => {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

function normalizeError(apiError, statusCode) {
  const status = apiError?.status ?? statusCode;
  const message = apiError?.message;
  let messages = [];
  if (Array.isArray(message)) {
    messages = message.filter(Boolean).map(String);
  } else if (typeof message === 'string' && message.trim().length > 0) {
    messages = [message];
  } else if (apiError && typeof apiError === 'object') {
    const possible = [apiError.messages, apiError.errors, apiError.details];
    for (const bucket of possible) {
      if (Array.isArray(bucket)) {
        messages = bucket.filter(Boolean).map(String);
        break;
      }
    }
  }

  const primaryMessage = messages[0] || `Request failed (${status})`;
  return { status, message, messages, primaryMessage };
}
