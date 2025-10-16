const BASE_URL = "https://yuanqfswhberkoevtmfr.supabase.co";
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ";

export const apikey = API_KEY;
let loginPromise = null;

// 🔹 Autenticação
export async function login() {
  const res = await fetch(`${BASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: API_KEY,
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      email: "riseup@popcode.com.br",
      password: "riseup",
    }),
  });

  const data = await res.json();
  if (typeof window !== "undefined") {
    localStorage.setItem("token", data.access_token);
  }
  return data;
}

async function request(endpoint, options = {}) {
  if (!loginPromise) loginPromise = login();

  try {
    await loginPromise;
  } catch (error) {
    console.error("Falha ao autenticar:", error);
  } finally {
    loginPromise = null;
  }

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Content-Type": "application/json",
    apikey: API_KEY,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(`Erro HTTP: ${response.status} - Detalhes: ${msg}`);
  }

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) return {};
  return await response.json();
}

export const api = {
  get: (endpoint, options) => request(endpoint, { method: "GET", ...options }),
  post: (endpoint, data) =>
    request(endpoint, { method: "POST", body: JSON.stringify(data) }),
  patch: (endpoint, data) =>
    request(endpoint, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (endpoint) => request(endpoint, { method: "DELETE" }),
};
