const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function apiRequest(path, options = {}) {
  const url = `${API_URL}${path}`;
  const resp = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: 'include', // Include cookies for session-based auth
    ...options,
  });

  // Check for session expiry (401 Unauthorized)
  if (resp.status === 401) {
    // Session expired, redirect to login
    window.location.href = '/login';
    const err = new Error('Session expired. Please login again.');
    err.details = { status: 401, primaryMessage: 'Session expired. Please login again.' };
    throw err;
  }

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

export const logout = async () => {
  return apiRequest('/auth/logout', {
    method: 'POST',
  });
};

// Job API functions
export const addJob = async (jobData, resumeFile) => {
  const formData = new FormData();
  
  // Add job data as JSON blob
  formData.append('job', new Blob([JSON.stringify(jobData)], {
    type: 'application/json'
  }));
  
  // Add resume file - create empty file if none provided since backend expects it
  if (resumeFile) {
    formData.append('resume', resumeFile);
  } else {
    // Create an empty file if no resume is provided
    const emptyFile = new File([''], 'no-resume.txt', { type: 'text/plain' });
    formData.append('resume', emptyFile);
  }

  const url = `${API_URL}/jobs`;
  const resp = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: formData, // Don't set Content-Type header, let browser set it with boundary
  });

  // Check for session expiry (401 Unauthorized)
  if (resp.status === 401) {
    // Session expired, redirect to login
    window.location.href = '/login';
    const err = new Error('Session expired. Please login again.');
    err.details = { status: 401, primaryMessage: 'Session expired. Please login again.' };
    throw err;
  }

  // Handle response same as apiRequest
  let envelope;
  try {
    envelope = await resp.json();
  } catch {
    envelope = null;
  }

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
};

export const getAllJobs = async (page = 0, filters = {}) => {
  // Check if any filters are applied
  const hasFilters = Object.values(filters).some(v => v);
  
  if (!hasFilters) {
    // No filters, use the basic getAllJobs endpoint
    return apiRequest(`/jobs?page=${page}`);
  }
  
  // Handle different filter combinations based on your backend endpoints
  if (filters.status && !filters.company && !filters.dateFrom && !filters.dateTo) {
    // Only status filter - use the status endpoint
    return apiRequest(`/jobs?status=${filters.status}&page=${page}`);
  }
  
  if (filters.company && !filters.status && !filters.dateFrom && !filters.dateTo) {
    // Only company filter - use the company endpoint
    return apiRequest(`/jobs/company/${encodeURIComponent(filters.company)}?page=${page}`);
  }
  
  if ((filters.dateFrom || filters.dateTo) && !filters.status && !filters.company) {
    // Only date range filter - use the between endpoint
    const from = filters.dateFrom || '1900-01-01';
    const to = filters.dateTo || '2100-12-31';
    return apiRequest(`/jobs/between?from=${from}&to=${to}&page=${page}`);
  }
  
  // For multiple filters, we'll need to get all jobs and filter client-side
  // This is a limitation of the current backend API structure
  const allJobs = await apiRequest(`/jobs?page=0`); // Get all jobs first
  
  let filteredJobs = Array.isArray(allJobs) ? allJobs : (allJobs?.content || []);
  
  // Apply client-side filtering
  if (filters.status) {
    filteredJobs = filteredJobs.filter(job => job.status === filters.status);
  }
  
  if (filters.company) {
    filteredJobs = filteredJobs.filter(job => 
      job.companyName.toLowerCase().includes(filters.company.toLowerCase())
    );
  }
  
  if (filters.dateFrom) {
    filteredJobs = filteredJobs.filter(job => 
      new Date(job.appliedDate) >= new Date(filters.dateFrom)
    );
  }
  
  if (filters.dateTo) {
    filteredJobs = filteredJobs.filter(job => 
      new Date(job.appliedDate) <= new Date(filters.dateTo)
    );
  }
  
  // Implement client-side pagination
  const pageSize = 10; // Adjust based on your backend page size
  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
  
  // Return in the expected format
  return {
    content: paginatedJobs,
    totalElements: filteredJobs.length,
    totalPages: Math.ceil(filteredJobs.length / pageSize),
    number: page,
    size: pageSize
  };
};

export const getJobById = async (id) => {
  return apiRequest(`/jobs/${id}`);
};

export const updateJob = async (id, jobData) => {
  return apiRequest(`/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(jobData),
  });
};

export const deleteJob = async (id) => {
  return apiRequest(`/jobs/${id}`, {
    method: 'DELETE',
  });
};

export const getJobsBetweenDates = async (from, to, page = 0) => {
  return apiRequest(`/jobs/between?from=${from}&to=${to}`);
};

export const getJobsByCompany = async (companyName, page = 0) => {
  return apiRequest(`/jobs/company/${encodeURIComponent(companyName)}`);
};

export const getJobsByStatus = async (status, page = 0) => {
  return apiRequest(`/jobs?status=${status}`);
};

export const getUserDetails = async () => {
  return apiRequest('/user');
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

// Utility function to normalize different response formats from backend
function normalizeJobsResponse(response) {
  if (!response) return { content: [], totalElements: 0, totalPages: 0 };
  
  // If it's already a paginated response
  if (response.content && Array.isArray(response.content)) {
    return response;
  }
  
  // If it's a simple array
  if (Array.isArray(response)) {
    return {
      content: response,
      totalElements: response.length,
      totalPages: 1,
      number: 0,
      size: response.length
    };
  }
  
  // Fallback
  return { content: [], totalElements: 0, totalPages: 0 };
}
