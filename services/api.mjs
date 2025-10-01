
const BASE_URL = "https://yuanqfswhberkoevtmfr.supabase.co";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1YW5xZnN3aGJlcmtvZXZ0bWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTQzNjksImV4cCI6MjA3MDUzMDM2OX0.g8Fm4XAvtX46zifBZnYVH4tVuQkqUH6Ia9CXQj4DztQ"; 
var tempToken;

async function login() {
  const response = await fetch("https://yuanqfswhberkoevtmfr.supabase.co/auth/v1/token?grant_type=password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": API_KEY,
    },
    body: JSON.stringify({ email: "riseup@popcode.com.br", password: "riseup" }),
  });

  const data = await response.json();
 
  localStorage.setItem("token", data.access_token);
  
  return data;
}


let loginPromise = login();


 
async function request(endpoint, options = {}) {
  
  if (loginPromise) {
    try {
        await loginPromise;
    } catch (error) {
        console.error("Falha na autenticação inicial:", error);
    }
 
    loginPromise = null; 
  }

  const token = localStorage.getItem("token"); 

  const headers = {
    "Content-Type": "application/json",
    "apikey": API_KEY, 
    ...(token ? { "Authorization": `Bearer ${token}` } : {}), 
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
     
      let errorBody = `Status: ${response.status}`;
      try {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const jsonError = await response.json();
        
          errorBody = jsonError.message || JSON.stringify(jsonError);
        } else {
          errorBody = await response.text();
        }
      } catch (e) {
       
        errorBody = `Status: ${response.status} - Falha ao ler corpo do erro.`;
      }
      
      throw new Error(`Erro HTTP: ${response.status} - Detalhes: ${errorBody}`);
    }
    const contentType = response.headers.get("content-type");
    if (response.status === 204 || (contentType && !contentType.includes("application/json")) || !contentType) {
      return {}; 
    }
    return await response.json();
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error;
  }
}
export const api = {
  get: (endpoint) => request(endpoint, { method: "GET" }),
  post: (endpoint, data) => request(endpoint, { method: "POST", body: JSON.stringify(data) }),
  patch: (endpoint, data) => request(endpoint, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (endpoint) => request(endpoint, { method: "DELETE" }),
};