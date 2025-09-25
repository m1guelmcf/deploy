/*********************************************
 * 🧠 COMPONENTE: PacientesPage (Refatorado, Corrigido e Completo)
 *
 * O QUE FAZ: Página principal para gerenciamento de pacientes.
 *
 * CORREÇÃO APLICADA:
 * - A lógica do hook `usePacientesComPaginacao` foi corrigida
 *   para garantir que o scroll infinito funcione corretamente,
 *   evitando o problema de "stale state".
 *
 * FUNCIONALIDADES MANTIDAS:
 * - Todos os filtros (Convênio, VIP, Aniversariantes).
 * - Todas as colunas da tabela.
 * - Todas as ações do menu (Ver detalhes, Editar, etc.).
 * - Carregamento infinito (scroll infinito).
 *
 *********************************************/

"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, Calendar, Filter } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import SecretaryLayout from "@/components/secretary-layout";

// --- TIPO DEFINIDO PARA O PACIENTE ---
type Paciente = {
    id: string;
    nome: string;
    telefone: string;
    cidade: string;
    estado: string;
    ultimoAtendimento?: string;
    proximoAtendimento?: string;
    convenio: string;
    vip: boolean;
    status?: string;
};

// --- HOOK CUSTOMIZADO PARA LÓGICA DE DADOS (VERSÃO FINAL E ROBUSTA) ---
const usePacientesComPaginacao = () => {
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [erro, setErro] = useState<string | null>(null);
    const [estaBuscando, setEstaBuscando] = useState(false);
    const [pagina, setPagina] = useState(1);
    const [temProximaPagina, setTemProximaPagina] = useState(true);
    const elementoObservadoRef = useRef<HTMLDivElement | null>(null);

    const buscarPacientes = async (paginaParaBuscar: number) => {
        if (estaBuscando) return;
        setEstaBuscando(true);
        setErro(null);
        try {
            const res = await fetch(`https://mock.apidog.com/m1/1053378-0-default/pacientes?page=${paginaParaBuscar}&limit=20`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const items = Array.isArray(json?.data) ? json.data : [];

            const mapped: Paciente[] = items.map((p: any) => ({
                id: String(p.id ?? ""),
                nome: p.nome ?? "",
                telefone: p?.contato?.celular ?? p?.contato?.telefone1 ?? p?.telefone ?? "",
                cidade: p?.endereco?.cidade ?? p?.cidade ?? "",
                estado: p?.endereco?.estado ?? p?.estado ?? "",
                ultimoAtendimento: p.ultimo_atendimento ?? p.ultimoAtendimento,
                proximoAtendimento: p.proximo_atendimento ?? p.proximoAtendimento,
                convenio: p.convenio ?? "",
                vip: Boolean(p.vip ?? false),
                status: p.status,
            }));

            setPacientes((prev) => [...prev, ...mapped]);
            setTemProximaPagina(Boolean(json?.pagination?.has_next));
            setPagina(paginaParaBuscar + 1);
        } catch (e: any) {
            setErro(e?.message || "Erro ao buscar pacientes");
        } finally {
            setEstaBuscando(false);
        }
    };

    // Efeito para a busca inicial (sem alterações)
    useEffect(() => {
        buscarPacientes(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // CORREÇÃO DEFINITIVA: LÓGICA PROATIVA GARANTIDA COM TIMEOUT
    useEffect(() => {
        if (!elementoObservadoRef.current || !temProximaPagina) return;

        // Mecanismo Reativo (Scroll do usuário) - continua igual
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !estaBuscando) {
                buscarPacientes(pagina);
            }
        });
        observer.observe(elementoObservadoRef.current);

        // Mecanismo Proativo (Preenchimento automático da tela)
        const checarPreenchimento = () => {
            if (estaBuscando || !temProximaPagina || !elementoObservadoRef.current) {
                return;
            }
            const { top } = elementoObservadoRef.current.getBoundingClientRect();
            if (top <= window.innerHeight) {
                buscarPacientes(pagina);
            }
        };

        // A MUDANÇA CRUCIAL:
        // Usamos um setTimeout para adiar a verificação. Isso dá ao navegador
        // tempo para renderizar os novos pacientes no DOM antes de medirmos a posição
        // do elemento gatilho. Isso elimina a inconsistência.
        const timeoutId = setTimeout(checarPreenchimento, 100); // 100ms é um tempo seguro

        // Função de limpeza para evitar memory leaks
        return () => {
            clearTimeout(timeoutId);
            if (elementoObservadoRef.current) {
                observer.unobserve(elementoObservadoRef.current);
            }
        };
    // A dependência em `pacientes` garante que esta lógica seja reavaliada
    // toda vez que uma nova leva de pacientes chegar.
    }, [pacientes, pagina, estaBuscando, temProximaPagina]);

    return { pacientes, erro, estaBuscando, elementoObservadoRef, setPacientes };
};

// --- COMPONENTES DE MODAL (COM TIPAGEM) ---
type ModalConfirmarExclusaoProps = { isOpen: boolean; onClose: () => void; onConfirm: () => void; };
const ModalConfirmarExclusao = ({ isOpen, onClose, onConfirm }: ModalConfirmarExclusaoProps) => (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);

type ModalDetalhesPacienteProps = { isOpen: boolean; onClose: () => void; detalhes: any | { error: string } | null; };
const ModalDetalhesPaciente = ({ isOpen, onClose, detalhes }: ModalDetalhesPacienteProps) => (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Detalhes do Paciente</AlertDialogTitle>
                <AlertDialogDescription asChild>
                    {detalhes === null ? (
                        <div className="text-gray-500">Carregando...</div>
                    ) : detalhes?.error ? (
                        <div className="text-red-600">{detalhes.error}</div>
                    ) : (
                        <div className="space-y-2 text-left text-gray-800">
                            <div><strong>Nome:</strong> {detalhes.nome}</div>
                            <div><strong>Telefone:</strong> {detalhes?.contato?.celular ?? detalhes?.contato?.telefone1 ?? detalhes?.telefone ?? ""}</div>
                            <div><strong>Cidade:</strong> {detalhes?.endereco?.cidade ?? detalhes?.cidade ?? ""}</div>
                            <div><strong>Estado:</strong> {detalhes?.endereco?.estado ?? detalhes?.estado ?? ""}</div>
                            <div><strong>Convênio:</strong> {detalhes.convenio ?? ""}</div>
                            <div><strong>VIP:</strong> {detalhes.vip ? "Sim" : "Não"}</div>
                            <div><strong>Status:</strong> {detalhes.status ?? ""}</div>
                            <div><strong>Último atendimento:</strong> {detalhes.ultimo_atendimento ?? detalhes.ultimoAtendimento ?? ""}</div>
                            <div><strong>Próximo atendimento:</strong> {detalhes.proximo_atendimento ?? detalhes.proximoAtendimento ?? ""}</div>
                        </div>
                    )}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={onClose}>Fechar</AlertDialogCancel>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
);

// --- COMPONENTE PRINCIPAL ---
export default function PacientesPage() {
    const { pacientes, erro, estaBuscando, elementoObservadoRef, setPacientes } = usePacientesComPaginacao();

    const [searchTerm, setSearchTerm] = useState("");
    const [convenioFilter, setConvenioFilter] = useState("all");
    const [vipFilter, setVipFilter] = useState("all");

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState<Paciente | null>(null);

    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [patientDetails, setPatientDetails] = useState<any | null>(null);

    const openDetailsDialog = async (patientId: string) => {
        setDetailsDialogOpen(true);
        setPatientDetails(null);
        try {
            const res = await fetch(`https://mock.apidog.com/m1/1053378-0-default/pacientes/${patientId}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            setPatientDetails(json?.data ?? null);
        } catch (e: any) {
            setPatientDetails({ error: e?.message || "Erro ao buscar detalhes" });
        }
    };

    const openDeleteDialog = (paciente: Paciente) => {
        setPatientToDelete(paciente);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!patientToDelete) return;
        setPacientes((prev) => prev.filter((p) => p.id !== patientToDelete.id));
        setDeleteDialogOpen(false);
        setPatientToDelete(null);
    };

    const filteredPatients = useMemo(() => {
        return pacientes.filter((patient) => {
            const matchesSearch = patient.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || patient.telefone?.includes(searchTerm);
            const matchesConvenio = convenioFilter === "all" || patient.convenio === convenioFilter;
            const matchesVip = vipFilter === "all" || (vipFilter === "vip" && patient.vip) || (vipFilter === "regular" && !patient.vip);
            return matchesSearch && matchesConvenio && matchesVip;
        });
    }, [pacientes, searchTerm, convenioFilter, vipFilter]);

    return (
        <SecretaryLayout>
            <div className="space-y-6">
                {/* --- CABEÇALHO DA PÁGINA (MANTIDO) --- */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
                        <p className="text-gray-600">Gerencie as informações de seus pacientes</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/secretary/pacientes/novo">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Adicionar
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* --- BARRA DE FILTROS (MANTIDA) --- */}
                <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Convênio</span>
                        <Select value={convenioFilter} onValueChange={setConvenioFilter}>
                            <SelectTrigger className="w-40"><SelectValue placeholder="Selecione" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="Particular">Particular</SelectItem>
                                <SelectItem value="SUS">SUS</SelectItem>
                                <SelectItem value="Unimed">Unimed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">VIP</span>
                        <Select value={vipFilter} onValueChange={setVipFilter}>
                            <SelectTrigger className="w-32"><SelectValue placeholder="Selecione" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="vip">VIP</SelectItem>
                                <SelectItem value="regular">Regular</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Aniversariantes</span>
                        <Select>
                            <SelectTrigger className="w-32"><SelectValue placeholder="Selecione" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">Hoje</SelectItem>
                                <SelectItem value="week">Esta semana</SelectItem>
                                <SelectItem value="month">Este mês</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button variant="outline" className="ml-auto bg-transparent">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtro avançado
                    </Button>
                </div>

                {/* --- TABELA DE PACIENTES (MANTIDA) --- */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="overflow-x-auto">
                        {erro ? (
                            <div className="p-6 text-red-600">{`Erro ao carregar pacientes: ${erro}`}</div>
                        ) : (
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
                                    {filteredPatients.length === 0 && !estaBuscando ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-gray-500">
                                                {pacientes.length === 0 ? "Nenhum paciente cadastrado" : "Nenhum paciente encontrado com os filtros aplicados"}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredPatients.map((patient) => (
                                            <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                            <span className="text-gray-600 font-medium text-sm">{patient.nome?.charAt(0) || "?"}</span>
                                                        </div>
                                                        <span className="font-medium text-gray-900">{patient.nome}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-gray-600">{patient.telefone}</td>
                                                <td className="p-4 text-gray-600">{patient.cidade}</td>
                                                <td className="p-4 text-gray-600">{patient.estado}</td>
                                                <td className="p-4 text-gray-600">{patient.ultimoAtendimento}</td>
                                                <td className="p-4 text-gray-600">{patient.proximoAtendimento}</td>
                                                <td className="p-4">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <div className="text-blue-600 cursor-pointer">Ações</div>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => openDetailsDialog(patient.id)}>
                                                                <Eye className="w-4 h-4 mr-2" /> Ver detalhes
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/secretary/pacientes/${patient.id}/editar`}>
                                                                    <Edit className="w-4 h-4 mr-2" /> Editar
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Calendar className="w-4 h-4 mr-2" /> Marcar consulta
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600" onClick={() => openDeleteDialog(patient)}>
                                                                <Trash2 className="w-4 h-4 mr-2" /> Excluir
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                        <div ref={elementoObservadoRef} style={{ height: 1 }} />
                        {estaBuscando && <div className="p-4 text-center text-gray-500">Carregando mais pacientes...</div>}
                    </div>
                </div>

                {/* --- MODAIS (MANTIDOS) --- */}
                <ModalConfirmarExclusao
                    isOpen={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                    onConfirm={handleConfirmDelete}
                />
                <ModalDetalhesPaciente
                    isOpen={detailsDialogOpen}
                    onClose={() => setDetailsDialogOpen(false)}
                    detalhes={patientDetails}
                />
            </div>
        </SecretaryLayout>
    );
}