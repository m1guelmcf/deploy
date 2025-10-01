
// váriaveis básicas
const BASE_URL = "https://yuanqfswhberkoevtmfr.supabase.co";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ"; 
var tempToken;

export async function login() {
  const response = await fetch("https://yuanqfswhberkoevtmfr.supabase.co/auth/v1/token?grant_type=password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=representation",
      "apikey": API_KEY, // valor fixo
    },
    body: JSON.stringify({ email: "riseup@popcode.com.br", password: "riseup" }),
  });

  const data = await response.json();
  // salvar o token do usuário
  localStorage.setItem("token", data.access_token);

  
  return data;
}

async function run(){
  await login()
}
run()

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token"); // token do usuário, salvo no login


  const headers = {
    "Content-Type": "application/json",
    "apikey": API_KEY, // obrigatório sempre
    ...(token ? { "Authorization": `Bearer ${token}` } : {}), // obrigatório em todas EXCETO login
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Erro HTTP:", response.status, text);
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    // Lê a resposta como texto
    const text = await response.text();

    // Se não tiver conteúdo (204 ou 201 sem body), retorna null
    if (!text) return null;

    // Se tiver conteúdo, parseia como JSON
    return JSON.parse(text);
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error;
  }
}

export const api = {
  get: (endpoint) => request(endpoint, { method: "GET" }),
  post: (endpoint, body) =>
    request(endpoint, { method: "POST", body: JSON.stringify(body) }),
  patch: (endpoint, body) =>
    request(endpoint, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: "DELETE" }),
};
