"use client";

import { useEffect, useState } from "react";
import ManagerLayout from "@/components/manager-layout";

interface Paciente {
  id: string;
  nome: string;
  telefone: string;
  cidade: string;
  estado: string;
  ultimoAtendimento?: string;
  proximoAtendimento?: string;
}

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPacientes() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("https://mock.apidog.com/m1/1053378-0-default/pacientes");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const items = Array.isArray(json?.data) ? json.data : [];

        const mapped = items.map((p: any) => ({
          id: String(p.id ?? ""),
          nome: p.nome ?? "",
          telefone: p?.contato?.celular ?? p?.contato?.telefone1 ?? p?.telefone ?? "",
          cidade: p?.endereco?.cidade ?? p?.cidade ?? "",
          estado: p?.endereco?.estado ?? p?.estado ?? "",
          ultimoAtendimento: p.ultimo_atendimento ?? p.ultimoAtendimento ?? "",
          proximoAtendimento: p.proximo_atendimento ?? p.proximoAtendimento ?? "",
        }));

        setPacientes(mapped);
      } catch (e: any) {
        setError(e?.message || "Erro ao carregar pacientes");
      } finally {
        setLoading(false);
      }
    }
    fetchPacientes();
  }, []);

  return (
    <ManagerLayout>
      <div></div>
    </ManagerLayout>
  );
}
