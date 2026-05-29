const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
  console.warn("Aviso: NEXT_PUBLIC_API_URL não está definida no ambiente.");
}

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") ?? "";
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
}

// ─── AUTH ──────────────────────────────────────────────
export async function loginApi(userId: string): Promise<{ access_token: string }> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });
  if (!res.ok) throw new Error("Erro ao autenticar");
  return res.json();
}

// ─── TREINOS ───────────────────────────────────────────
export async function getTreinos() {
  const res = await fetch(`${API_URL}/treinos/`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Erro ao buscar treinos");
  return res.json();
}

export async function getTreino(idTreino: string) {
  const res = await fetch(`${API_URL}/treinos/${idTreino}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Erro ao buscar treino");
  return res.json();
}

export async function deleteTreino(idTreino: string) {
  const res = await fetch(`${API_URL}/treinos/${idTreino}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Erro ao deletar treino");
  return res.json();
}

// ─── GERAÇÃO DE TREINO ─────────────────────────────────
export async function gerarTreino(payload: {
  idade: number;
  peso: number;
  altura: number;
  objetivo: string;
  nivel: string;
  dias_treino: number;
}) {
  const res = await fetch(`${API_URL}/ia/generate-workout`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Erro ao gerar treino");
  return res.json();
}

// ─── EXECUÇÃO ──────────────────────────────────────────
export async function registrarExecucao(payload: {
  id_treino: string;
  duracao?: number | null;
  exercicios: {
    id: string;
    series_realizadas?: number | null;
    reps_realizadas?: number | null;
    peso_utilizado?: number | null;
  }[];
}) {
  const res = await fetch(`${API_URL}/execucao/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Erro ao registrar execução");
  return res.json();
}

export async function getHistoricoExecucao() {
  const res = await fetch(`${API_URL}/execucao/historico/me`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Erro ao buscar histórico");
  return res.json();
}
