const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

// Central fetch wrapper: attaches the JWT if present, parses JSON,
// and throws a normalized Error with a readable message on failure.
async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new Error("Could not reach the server. Check your connection and try again.");
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw new Error(data?.error || `Request failed (${response.status})`);
  }

  return data;
}

export const api = {
  register: (email, password) => request("/auth/register", { method: "POST", body: { email, password } }),
  login: (email, password) => request("/auth/login", { method: "POST", body: { email, password } }),

  listApplications: (token) => request("/applications", { token }),
  getApplication: (id, token) => request(`/applications/${id}`, { token }),
  createApplication: (data, token) => request("/applications", { method: "POST", body: data, token }),
  updateApplication: (id, data, token) => request(`/applications/${id}`, { method: "PUT", body: data, token }),
  deleteApplication: (id, token) => request(`/applications/${id}`, { method: "DELETE", token }),

  draftFollowup: (applicationId, kind, token) =>
    request("/ai/draft-followup", { method: "POST", body: { applicationId, kind }, token }),
};
