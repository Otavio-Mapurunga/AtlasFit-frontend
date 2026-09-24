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

interface AlunoOut {
  id_aluno: string;
  nome: string;
  email: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  aluno: AlunoOut;
}

// ─── AUTH ──────────────────────────────────────────────
export async function registerApi(nome: string, email: string, senha: string): Promise<TokenResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? "Erro ao criar conta");
  }
  return res.json();
}

export async function loginApi(email: string, senha: string): Promise<TokenResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? "Erro ao autenticar");
  }
  return res.json();
}

// ─── ANAMNESE ──────────────────────────────────────────
export async function criarAnamnese(payload: {
  altura: number;
  peso: number;
  sexo: string;
  objetivo: string[];
  experiencia: string;
  lesoes?: string[] | null;
  dias_treino?: number | null;
  idade: number;
  observacoes_medicas: string;
  equipamentos?: string[] | null;
  preferencias: string;
}) {
  const res = await fetch(`${API_URL}/anamnese/`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Erro ao salvar anamnese");
  return res.json();
}

export async function getAnamnese() {
  const res = await fetch(`${API_URL}/anamnese/`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Erro ao buscar anamnese");
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
export async function gerarTreino() {
  const res = await fetch(`${API_URL}/ia/generate-workout`, {
    method: "POST",
    headers: authHeaders(),
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
  const res = await fetch(`${API_URL}/execucao/historico`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Erro ao buscar histórico");
  return res.json();
}