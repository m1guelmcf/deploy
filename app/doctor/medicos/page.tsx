"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, Calendar, Filter } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import DoctorLayout from "@/components/doctor-layout";
export default function MedicosPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [especialidadeFilter, setEspecialidadeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [doctorDetails, setDoctorDetails] = useState<any | null>(null);
    const openDetailsDialog = async (doctorId: string) => {
        setDetailsDialogOpen(true);
        setDoctorDetails(null);
        try {
            const res = await fetch(`https://mock.apidog.com/m1/1053378-0-default/pacientes/${doctorId}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            setDoctorDetails(json?.data ?? null);
        } catch (e: any) {
            setDoctorDetails({ error: e?.message || "Erro ao buscar detalhes" });
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        async function fetchFromPacientes() {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch("https://mock.apidog.com/m1/1053378-0-default/pacientes", {
                    signal: controller.signal,
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                const items = Array.isArray(json?.data) ? json.data : [];
                const mapped = items.map((p: any) => ({
                    id: String(p.id ?? ""),
                    nome: p.nome ?? "",
                    crm: "",
                    especialidade: "",
                    telefone: p?.contato?.celular ?? p?.contato?.telefone1 ?? p?.telefone ?? "",
                    cidade: p?.endereco?.cidade ?? p?.cidade ?? "",
                    estado: p?.endereco?.estado ?? p?.estado ?? "",
                    ultimoAtendimento: p.ultimo_atendimento ?? p.ultimoAtendimento ?? "",
                    proximoAtendimento: p.proximo_atendimento ?? p.proximoAtendimento ?? "",
                    status: p.status ?? "",
                }));
                setDoctors(mapped);
            } catch (e: any) {
                const isAbort = e?.name === "AbortError" || /aborted/i.test(e?.message || "");
                if (isAbort) return;
                setError(e?.message || "Erro ao carregar dados");
            } finally {
                setLoading(false);
            }
        }
        fetchFromPacientes();
        return () => controller.abort();
    }, []);

    const handleDeleteDoctor = async (doctorId: string) => {
        try {
            await fetch(`https://mock.apidog.com/m1/1053378-0-default/pacientes/${doctorId}`, {
                method: "DELETE",
            });
        } catch {}
        setDoctors((prev) => prev.filter((doctor) => String(doctor.id) !== String(doctorId)));
        setDeleteDialogOpen(false);
        setDoctorToDelete(null);
    };

    const openDeleteDialog = (doctorId: string) => {
        setDoctorToDelete(doctorId);
        setDeleteDialogOpen(true);
    };

    const filteredDoctors = doctors.filter((doctor) => {
        const matchesSearch = doctor.nome.toLowerCase().includes(searchTerm.toLowerCase()) || doctor.crm.toLowerCase().includes(searchTerm.toLowerCase()) || doctor.telefone.includes(searchTerm);
        const matchesEspecialidade = especialidadeFilter === "all" || doctor.especialidade === especialidadeFilter;
        const matchesStatus = statusFilter === "all" || doctor.status === statusFilter;

        return matchesSearch && matchesEspecialidade && matchesStatus;
    });

    return (
        <DoctorLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Médicos</h1>
                        <p className="text-gray-600">Gerencie as informações dos médicos</p>
                    </div>
                    <Link href="/doctor/medicos/novo">
                        <Button className="bg-green-600 hover:bg-green-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar
                        </Button>
                    </Link>
                </div>

                <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Especialidade</span>
                        <Select value={especialidadeFilter} onValueChange={setEspecialidadeFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Selecione a Especialidade" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="Cardiologia">Cardiologia</SelectItem>
                                <SelectItem value="Pediatria">Pediatria</SelectItem>
                                <SelectItem value="Ortopedia">Ortopedia</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Status</span>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="Ativo">Ativo</SelectItem>
                                <SelectItem value="Inativo">Inativo</SelectItem>
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
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left p-4 font-medium text-gray-700">Nome</th>
                                    <th className="text-left p-4 font-medium text-gray-700">CRM</th>
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
                                        <td colSpan={8} className="p-6 text-gray-600">
                                            Carregando médicos...
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan={8} className="p-6 text-red-600">{`Erro: ${error}`}</td>
                                    </tr>
                                ) : filteredDoctors.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="p-8 text-center text-gray-500">
                                            Nenhum registro encontrado
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDoctors.map((doctor) => (
                                        <tr key={doctor.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                        <span className="text-gray-600 font-medium text-sm">{doctor.nome?.charAt(0) || "?"}</span>
                                                    </div>
                                                    <span className="font-medium text-gray-900">{doctor.nome}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-600">{doctor.crm}</td>
                                            <td className="p-4 text-gray-600">{doctor.telefone}</td>
                                            <td className="p-4 text-gray-600">{doctor.cidade}</td>
                                            <td className="p-4 text-gray-600">{doctor.estado}</td>
                                            <td className="p-4 text-gray-600">{doctor.ultimoAtendimento}</td>
                                            <td className="p-4 text-gray-600">{doctor.proximoAtendimento}</td>
                                            <td className="p-4">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <div className="text-blue-600">Ações</div>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openDetailsDialog(String(doctor.id))}>
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            Ver detalhes
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/doctor/medicos/${doctor.id}/editar`}>
                                                                <Edit className="w-4 h-4 mr-2" />
                                                                Editar
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Calendar className="w-4 h-4 mr-2" />
                                                            Ver agenda
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600" onClick={() => openDeleteDialog(String(doctor.id))}>
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
                    </div>
                </div>

                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>Tem certeza que deseja excluir este médico? Esta ação não pode ser desfeita.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => doctorToDelete && handleDeleteDoctor(doctorToDelete)} className="bg-red-600 hover:bg-red-700">
                                Excluir
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Modal de detalhes do médico */}
                <AlertDialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Detalhes do Médico</AlertDialogTitle>
                            <AlertDialogDescription>
                                {doctorDetails === null ? (
                                    <div className="text-gray-500">Carregando...</div>
                                ) : doctorDetails?.error ? (
                                    <div className="text-red-600">{doctorDetails.error}</div>
                                ) : (
                                    <div className="space-y-2 text-left">
                                        <div>
                                            <strong>Nome:</strong> {doctorDetails.nome}
                                        </div>
                                        <div>
                                            <strong>Telefone:</strong> {doctorDetails?.contato?.celular ?? doctorDetails?.contato?.telefone1 ?? doctorDetails?.telefone ?? ""}
                                        </div>
                                        <div>
                                            <strong>Cidade:</strong> {doctorDetails?.endereco?.cidade ?? doctorDetails?.cidade ?? ""}
                                        </div>
                                        <div>
                                            <strong>Estado:</strong> {doctorDetails?.endereco?.estado ?? doctorDetails?.estado ?? ""}
                                        </div>
                                        <div>
                                            <strong>Convênio:</strong> {doctorDetails.convenio ?? ""}
                                        </div>
                                        <div>
                                            <strong>VIP:</strong> {doctorDetails.vip ? "Sim" : "Não"}
                                        </div>
                                        <div>
                                            <strong>Status:</strong> {doctorDetails.status ?? ""}
                                        </div>
                                        <div>
                                            <strong>Último atendimento:</strong> {doctorDetails.ultimo_atendimento ?? doctorDetails.ultimoAtendimento ?? ""}
                                        </div>
                                        <div>
                                            <strong>Próximo atendimento:</strong> {doctorDetails.proximo_atendimento ?? doctorDetails.proximoAtendimento ?? ""}
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
        </DoctorLayout>
    );
}
