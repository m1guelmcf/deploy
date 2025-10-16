const BASE_URL = "https://yuanqfswhberkoevtmfr.supabase.co";
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ";

export const apikey = API_KEY;
let loginPromise = null;

export async function login() {
  console.log("🔐 Iniciando login...");
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

  if (!res.ok) {
    const msg = await res.text();
    console.error("❌ Erro no login:", res.status, msg);
    throw new Error(`Erro ao autenticar: ${res.status} - ${msg}`);
  }

  const data = await res.json();
  console.log("✅ Login bem-sucedido:", data);

  if (typeof window !== "undefined" && data.access_token) {
    localStorage.setItem("token", data.access_token);
  }

  return data;
}

async function request(endpoint, options = {}) {
  if (!loginPromise) loginPromise = login();

  try {
    await loginPromise;
  } catch (error) {
    console.error("⚠️ Falha ao autenticar:", error);
  } finally {
    loginPromise = null;
  }

  let token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (!token) {
    console.warn("⚠️ Token não encontrado, refazendo login...");
    const data = await login();
    token = data.access_token;
  }

  const headers = {
    "Content-Type": "application/json",
    apikey: API_KEY,
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const fullUrl =
    endpoint.startsWith("/rest/v1") || endpoint.startsWith("/functions/")
      ? `${BASE_URL}${endpoint}`
      : `${BASE_URL}/rest/v1${endpoint}`;

  console.log("🌐 Requisição para:", fullUrl, "com headers:", headers);

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const msg = await response.text();
    console.error("❌ Erro HTTP:", response.status, msg);
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

