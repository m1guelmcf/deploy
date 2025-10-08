"use client";

import type React from "react";
import { useState, useEffect } from "react";
import DoctorLayout from "@/components/doctor-layout"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, MapPin, Phone, User, X, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const APPOINTMENTS_STORAGE_KEY = "clinic-appointments";

// --- TIPAGEM DA CONSULTA SALVA NO LOCALSTORAGE ---
// Reflete a estrutura salva pelo secretarypage.tsx
interface LocalStorageAppointment {
    id: number; // ID único simples (timestamp)
    patientName: string;
    doctor: string;       // Nome completo do médico (para filtrar)
    specialty: string;
    date: string;         // Data no formato YYYY-MM-DD
    time: string;         // Hora no formato HH:MM
    status: "agendada" | "confirmada" | "cancelada" | "realizada";
    location: string;
    phone: string;
}

// --- SIMULAÇÃO DO MÉDICO LOGADO ---
// **IMPORTANTE**: Em um ambiente real, este valor viria do seu sistema de autenticação.
// Use um nome que corresponda a um médico que você cadastrou e usou para agendar.
const LOGGED_IN_DOCTOR_NAME = "Dr. João Silva"; // <--- AJUSTE ESTE NOME PARA TESTAR

// --- COMPONENTE PRINCIPAL ---

export default function DoctorAppointmentsPage() {
    const [appointments, setAppointments] = useState<LocalStorageAppointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = () => {
        setIsLoading(true);
        try {
            const storedAppointmentsRaw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
            const allAppointments: LocalStorageAppointment[] = storedAppointmentsRaw ? JSON.parse(storedAppointmentsRaw) : [];

            // 1. FILTRAGEM CRÍTICA: Apenas as consultas para o médico logado
            const filteredAppointments = allAppointments.filter(
                (app) => app.doctor === LOGGED_IN_DOCTOR_NAME
            );

            // 2. Ordena por Data e Hora
            filteredAppointments.sort((a, b) => {
                const dateTimeA = new Date(`${a.date}T${a.time}:00`);
                const dateTimeB = new Date(`${b.date}T${b.time}:00`);
                return dateTimeA.getTime() - dateTimeB.getTime();
            });

            setAppointments(filteredAppointments);
            toast.success("Agenda atualizada com sucesso!");
        } catch (error) {
            console.error("Erro ao carregar a agenda do LocalStorage:", error);
            toast.error("Não foi possível carregar sua agenda.");
        } finally {
            setIsLoading(false);
        }
    };

    // Função utilitária para mapear o status para a cor da Badge
    const getStatusVariant = (status: LocalStorageAppointment['status']) => {
        switch (status) {
            case "confirmada":
            case "agendada":
                return "default";
            case "realizada":
                return "secondary";
            case "cancelada":
                return "destructive";
            default:
                return "outline";
        }
    };

    const handleCancel = (id: number) => {
        // Lógica para CANCELAR a consulta no LocalStorage
        const storedAppointmentsRaw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
        const allAppointments: LocalStorageAppointment[] = storedAppointmentsRaw ? JSON.parse(storedAppointmentsRaw) : [];

        const updatedAppointments = allAppointments.map(app => 
            app.id === id ? { ...app, status: "cancelada" as const } : app
        );

        localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updatedAppointments));
        loadAppointments(); // Recarrega a lista filtrada
        toast.info(`Consulta cancelada com sucesso.`);
    };

    const handleReSchedule = (id: number) => {
        // Aqui você navegaria para a tela de agendamento passando o ID para pré-preencher
        toast.info(`Reagendamento da Consulta ID: ${id}. Navegar para a página de agendamento.`);
    };

    return (
        <DoctorLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Minhas Consultas</h1>
                    <p className="text-gray-600">Agenda atual ({LOGGED_IN_DOCTOR_NAME}) e histórico de atendimentos</p>
                </div>

                <div className="flex justify-end">
                    <Button onClick={loadAppointments} disabled={isLoading} variant="outline" size="sm">
                        <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Atualizar Agenda
                    </Button>
                </div>

                <div className="space-y-4">
                    {isLoading ? (
                        <p className="text-center text-lg text-gray-500">Carregando a agenda...</p>
                    ) : appointments.length === 0 ? (
                        <p className="text-center text-lg text-gray-500">Nenhuma consulta agendada para você (Médico: {LOGGED_IN_DOCTOR_NAME}).</p>
                    ) : (
                        appointments.map((appointment) => {
                            // Formatação de data e hora
                            const showActions = appointment.status === "agendada" || appointment.status === "confirmada";

                            return (
                                <Card key={appointment.id} className="shadow-lg">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        {/* NOME DO PACIENTE */}
                                        <CardTitle className="text-xl font-semibold flex items-center">
                                            <User className="mr-2 h-5 w-5 text-blue-600" />
                                            {appointment.patientName}
                                        </CardTitle>
                                        {/* STATUS DA CONSULTA */}
                                        <Badge variant={getStatusVariant(appointment.status)} className="uppercase">
                                            {appointment.status}
                                        </Badge>
                                    </CardHeader>

                                    <CardContent className="grid md:grid-cols-3 gap-4 pt-4">
                                        {/* COLUNA 1: Data e Hora */}
                                        <div className="space-y-3">
                                            <div className="flex items-center text-sm text-gray-700">
                                                <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                                                {new Date(appointment.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-700">
                                                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                                                {appointment.time}
                                            </div>
                                        </div>

                                        {/* COLUNA 2: Local e Contato */}
                                        <div className="space-y-3">
                                            <div className="flex items-center text-sm text-gray-700">
                                                <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                                                {appointment.location}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-700">
                                                <Phone className="mr-2 h-4 w-4 text-gray-500" />
                                                {/* Note: O telefone do paciente não está salvo no LocalStorage no seu código atual, usando um valor fixo */}
                                                {(appointment.phone || "(11) 9XXXX-YYYY")} 
                                            </div>
                                        </div>

                                        {/* COLUNA 3: Ações (Botões) */}
                                        <div className="flex flex-col justify-center items-end">
                                            {showActions && (
                                                <div className="flex space-x-2">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => handleReSchedule(appointment.id)}
                                                    >
                                                        <RefreshCw className="mr-2 h-4 w-4" />
                                                        Reagendar
                                                    </Button>
                                                    <Button 
                                                        variant="destructive" 
                                                        size="sm"
                                                        onClick={() => handleCancel(appointment.id)}
                                                    >
                                                        <X className="mr-2 h-4 w-4" />
                                                        Cancelar
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>
            </div>
        </DoctorLayout>
    );
}