const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn("Aviso: NEXT_PUBLIC_API_URL não está definida no ambiente.");
}

// ─── TREINOS ───────────────────────────────────────────

export async function getTreinos(idAluno: string) {
  const res = await fetch(`${API_URL}/treinos/?id_aluno=${idAluno}`);
  if (!res.ok) throw new Error("Erro ao buscar treinos");
  return res.json();
}

export async function getTreino(idTreino: string, idAluno: string) {
  const res = await fetch(`${API_URL}/treinos/${idTreino}?id_aluno=${idAluno}`);
  if (!res.ok) throw new Error("Erro ao buscar treino");
  return res.json();
}

export async function deleteTreino(idTreino: string, idAluno: string) {
  const res = await fetch(`${API_URL}/treinos/${idTreino}?id_aluno=${idAluno}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erro ao deletar treino");
  return res.json();
}

// ─── GERAÇÃO DE TREINO ─────────────────────────────────

export async function gerarTreino(idAluno: string) {
  const res = await fetch(`${API_URL}/gerar-treino/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_aluno: idAluno }),
  });
  if (!res.ok) throw new Error("Erro ao gerar treino");
  return res.json();
}

// ─── EXECUÇÃO ──────────────────────────────────────────

export async function registrarExecucao(payload: {
  id_treino: string;
  id_aluno: string;
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Erro ao registrar execução");
  return res.json();
}

export async function getHistoricoExecucao(idAluno: string) {
  const res = await fetch(`${API_URL}/execucao/historico/${idAluno}`);
  if (!res.ok) throw new Error("Erro ao buscar histórico");
  return res.json();
}
