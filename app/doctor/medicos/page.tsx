"use client";

import { useEffect, useState } from "react";
import DoctorLayout from "@/components/doctor-layout";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Edit, Calendar } from "lucide-react";

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
        const res = await fetch("https://mock.apidog.com/m1/1053378-0-default/rest/v1/patients");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        // A API pode retornar o array diretamente ou dentro de uma propriedade 'data'
        const items = Array.isArray(json) ? json : (Array.isArray(json?.data) ? json.data : []);

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
    <DoctorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
          <p className="text-gray-600">Lista de pacientes vinculados</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">Nome</th>
                  <th className="text-left p-4 font-medium text-gray-700">Telefone</th>
                  <th className="text-left p-4 font-medium text-gray-700">Cidade</th>
                  <th className="text-left p-4 font-medium text-gray-700">Estado</th>
                  <th className="text-left p-4 font-medium text-gray-700">Último atendimento</th>
                  <th className="text-left p-4 font-medium text-gray-700">Próximo atendimento</th>
                  <th className="text-left p-4 font-medium text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-gray-600">
                     Carregando pacientes...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-red-600">{`Erro: ${error}`}</td>
                  </tr>
                ) : pacientes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      Nenhum paciente encontrado
                    </td>
                  </tr>
                ) : (
                  pacientes.map((p) => (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">{p.nome}</td>
                      <td className="p-4 text-gray-600">{p.telefone}</td>
                      <td className="p-4 text-gray-600">{p.cidade}</td>
                      <td className="p-4 text-gray-600">{p.estado}</td>
                      <td className="p-4 text-gray-600">{p.ultimoAtendimento}</td>
                      <td className="p-4 text-gray-600">{p.proximoAtendimento}</td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="text-blue-600 hover:underline">Ações</button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => alert(`Detalhes para paciente ID: ${p.id}`)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/doctor/medicos/${p.id}/laudos`}>
                                <Edit className="w-4 h-4 mr-2" />
                                Laudos
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => alert(`Agenda para paciente ID: ${p.id}`)}>
                              <Calendar className="w-4 h-4 mr-2" />
                              Ver agenda
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
}