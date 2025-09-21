"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, Calendar, Filter } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import SecretaryLayout from "@/components/secretary-layout";

export default function PacientesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [convenioFilter, setConvenioFilter] = useState("all");
    const [vipFilter, setVipFilter] = useState("all");
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const observerRef = useRef<HTMLDivElement | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [patientToDelete, setPatientToDelete] = useState<string | null>(null);
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

    const fetchPacientes = useCallback(
        async (pageToFetch: number) => {
            if (isFetching || !hasNext) return;
            setIsFetching(true);
            setError(null);
            try {
                const res = await fetch(`https://mock.apidog.com/m1/1053378-0-default/pacientes?page=${pageToFetch}&limit=20`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                const items = Array.isArray(json?.data) ? json.data : [];
                const mapped = items.map((p: any) => ({
                    id: String(p.id ?? ""),
                    nome: p.nome ?? "",
                    telefone: p?.contato?.celular ?? p?.contato?.telefone1 ?? p?.telefone ?? "",
                    cidade: p?.endereco?.cidade ?? p?.cidade ?? "",
                    estado: p?.endereco?.estado ?? p?.estado ?? "",
                    ultimoAtendimento: p.ultimo_atendimento ?? p.ultimoAtendimento ?? undefined,
                    proximoAtendimento: p.proximo_atendimento ?? p.proximoAtendimento ?? undefined,
                    convenio: p.convenio ?? "",
                    vip: Boolean(p.vip ?? false),
                    status: p.status ?? undefined,
                }));
                setPatients((prev) => [...prev, ...mapped]);
                setHasNext(Boolean(json?.pagination?.has_next));
                setPage(pageToFetch + 1);
            } catch (e: any) {
                setError(e?.message || "Erro ao buscar pacientes");
            } finally {
                setIsFetching(false);
            }
        },
        [isFetching, hasNext]
    );

    useEffect(() => {
        fetchPacientes(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!observerRef.current || !hasNext) return;
        const observer = new window.IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isFetching && hasNext) {
                fetchPacientes(page);
            }
        });
        observer.observe(observerRef.current);
        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [fetchPacientes, page, hasNext, isFetching]);

    const handleDeletePatient = (patientId: string) => {
        // Remove from current list (client-side deletion)
        setPatients((prev) => prev.filter((p) => String(p.id) !== String(patientId)));
        setDeleteDialogOpen(false);
        setPatientToDelete(null);
    };

    const openDeleteDialog = (patientId: string) => {
        setPatientToDelete(patientId);
        setDeleteDialogOpen(true);
    };

    const filteredPatients = patients.filter((patient) => {
        const matchesSearch = patient.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || patient.telefone?.includes(searchTerm);
        const matchesConvenio = convenioFilter === "all" || (patient.convenio ?? "") === convenioFilter;
        const matchesVip = vipFilter === "all" || (vipFilter === "vip" && patient.vip) || (vipFilter === "regular" && !patient.vip);

        return matchesSearch && matchesConvenio && matchesVip;
    });

    return (
        <SecretaryLayout>
            <div className="space-y-6">
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

                <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Convênio</span>
                        <Select value={convenioFilter} onValueChange={setConvenioFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Selecione o Convênio" />
                            </SelectTrigger>
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
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
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
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
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

                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="overflow-x-auto">
                        {error ? (
                            <div className="p-6 text-red-600">{`Erro ao carregar pacientes: ${error}`}</div>
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
                                    {filteredPatients.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-gray-500">
                                                {patients.length === 0 ? "Nenhum paciente cadastrado" : "Nenhum paciente encontrado com os filtros aplicados"}
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
                                                            <div className="text-blue-600">Ações</div>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => openDetailsDialog(String(patient.id))}>
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                Ver detalhes
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/secretary/pacientes/${patient.id}/editar`}>
                                                                    <Edit className="w-4 h-4 mr-2" />
                                                                    Editar
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Calendar className="w-4 h-4 mr-2" />
                                                                Marcar consulta
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600" onClick={() => openDeleteDialog(String(patient.id))}>
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Excluir
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
                        <div ref={observerRef} style={{ height: 1 }} />
                        {isFetching && <div className="p-4 text-center text-gray-500">Carregando mais pacientes...</div>}
                    </div>
                </div>

                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => patientToDelete && handleDeletePatient(patientToDelete)} className="bg-red-600 hover:bg-red-700">
                                Excluir
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Modal de detalhes do paciente */}
                <AlertDialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Detalhes do Paciente</AlertDialogTitle>
                            <AlertDialogDescription>
                                {patientDetails === null ? (
                                    <div className="text-gray-500">Carregando...</div>
                                ) : patientDetails?.error ? (
                                    <div className="text-red-600">{patientDetails.error}</div>
                                ) : (
                                    <div className="space-y-2 text-left">
                                        <div>
                                            <strong>Nome:</strong> {patientDetails.nome}
                                        </div>
                                        <div>
                                            <strong>Telefone:</strong> {patientDetails?.contato?.celular ?? patientDetails?.contato?.telefone1 ?? patientDetails?.telefone ?? ""}
                                        </div>
                                        <div>
                                            <strong>Cidade:</strong> {patientDetails?.endereco?.cidade ?? patientDetails?.cidade ?? ""}
                                        </div>
                                        <div>
                                            <strong>Estado:</strong> {patientDetails?.endereco?.estado ?? patientDetails?.estado ?? ""}
                                        </div>
                                        <div>
                                            <strong>Convênio:</strong> {patientDetails.convenio ?? ""}
                                        </div>
                                        <div>
                                            <strong>VIP:</strong> {patientDetails.vip ? "Sim" : "Não"}
                                        </div>
                                        <div>
                                            <strong>Status:</strong> {patientDetails.status ?? ""}
                                        </div>
                                        <div>
                                            <strong>Último atendimento:</strong> {patientDetails.ultimo_atendimento ?? patientDetails.ultimoAtendimento ?? ""}
                                        </div>
                                        <div>
                                            <strong>Próximo atendimento:</strong> {patientDetails.proximo_atendimento ?? patientDetails.proximoAtendimento ?? ""}
                                        </div>
                                    </div>
                                )}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Fechar</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </SecretaryLayout>
    );
}
