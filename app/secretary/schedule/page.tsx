"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SecretaryLayout from "@/components/secretary-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User } from "lucide-react";
import { patientsService } from "@/services/patientsApi.mjs";
import { doctorsService } from "@/services/doctorsApi.mjs";
import { appointmentsService } from "@/services/appointmentsApi.mjs";
import { usersService } from "@/services/usersApi.mjs"; // 1. IMPORTAR O SERVIÇO DE USUÁRIOS
import { toast } from "sonner";

export default function ScheduleAppointment() {
    const router = useRouter();
    const [patients, setPatients] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null); // 2. NOVO ESTADO PARA O ID DO USUÁRIO

    // Estados do formulário
    const [selectedPatient, setSelectedPatient] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [appointmentType, setAppointmentType] = useState("presencial");
    const [durationMinutes, setDurationMinutes] = useState("30");
    const [chiefComplaint, setChiefComplaint] = useState("");
    const [patientNotes, setPatientNotes] = useState("");
    const [internalNotes, setInternalNotes] = useState("");
    const [insuranceProvider, setInsuranceProvider] = useState("");

    const availableTimes = [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
    ];

    // Efeito para carregar todos os dados iniciais (pacientes, médicos e usuário atual)
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Busca tudo em paralelo para melhor performance
                const [patientList, doctorList, currentUser] = await Promise.all([
                    patientsService.list(),
                    doctorsService.list(),
                    usersService.summary_data() // 3. CHAMADA PARA BUSCAR O USUÁRIO
                ]);

                setPatients(patientList);
                setDoctors(doctorList);

                if (currentUser && currentUser.id) {
                    setCurrentUserId(currentUser.id); // Armazena o ID do usuário no estado
                    console.log("Usuário logado identificado:", currentUser.id);
                } else {
                    toast.error("Não foi possível identificar o usuário logado. O agendamento pode falhar.");
                }

            } catch (error) {
                console.error("Falha ao buscar dados iniciais:", error);
                toast.error("Não foi possível carregar os dados necessários para a página.");
            }
        };
        fetchInitialData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 4. ADICIONAR VALIDAÇÃO PARA O ID DO USUÁRIO
        if (!currentUserId) {
            toast.error("Sessão de usuário inválida. Por favor, faça login novamente.");
            return;
        }

        if (!selectedPatient || !selectedDoctor || !selectedDate || !selectedTime) {
            toast.error("Paciente, médico, data e horário são obrigatórios.");
            return;
        }

        try {
            const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00Z`).toISOString();

            const newAppointmentData = {
                patient_id: selectedPatient,
                doctor_id: selectedDoctor,
                scheduled_at: scheduledAt,
                duration_minutes: parseInt(durationMinutes, 10),
                appointment_type: appointmentType,
                status: "requested",
                chief_complaint: chiefComplaint || null,
                patient_notes: patientNotes || null,
                notes: internalNotes || null,
                insurance_provider: insuranceProvider || null,
                created_by: currentUserId, // 5. INCLUIR O ID DO USUÁRIO NO OBJETO
            };

            console.log("Enviando dados do agendamento:", newAppointmentData); // Log para depuração

            await appointmentsService.create(newAppointmentData);

            toast.success("Consulta agendada com sucesso!");
            router.push("/secretary/appointments");
        } catch (error) {
            console.error("Erro ao criar agendamento:", error);
            toast.error("Ocorreu um erro ao agendar a consulta. Tente novamente.");
        }
    };

    return (
        <SecretaryLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Agendar Consulta</h1>
                    <p className="text-gray-600">Preencha os detalhes para criar um novo agendamento</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Dados da Consulta</CardTitle>
                                <CardDescription>Preencha as informações para agendar a consulta</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* O restante do formulário permanece exatamente o mesmo */}
                                    <div className="space-y-2">
                                        <Label htmlFor="patient">Paciente</Label>
                                        <Select value={selectedPatient} onValueChange={setSelectedPatient}><SelectTrigger><SelectValue placeholder="Selecione um paciente" /></SelectTrigger><SelectContent>{patients.map((p) => (<SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>))}</SelectContent></Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="doctor">Médico</Label>
                                        <Select value={selectedDoctor} onValueChange={setSelectedDoctor}><SelectTrigger><SelectValue placeholder="Selecione um médico" /></SelectTrigger><SelectContent>{doctors.map((d) => (<SelectItem key={d.id} value={d.id}>{d.full_name} - {d.specialty}</SelectItem>))}</SelectContent></Select>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="date">Data</Label>
                                            <Input id="date" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="time">Horário</Label>
                                            <Select value={selectedTime} onValueChange={setSelectedTime}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione um horário" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableTimes.map((time) => (
                                                        <SelectItem key={time} value={time}>
                                                            {time}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="appointmentType">Tipo de Consulta</Label>
                                            <Select value={appointmentType} onValueChange={setAppointmentType}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="presencial">Presencial</SelectItem><SelectItem value="telemedicina">Telemedicina</SelectItem></SelectContent></Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="duration">Duração (minutos)</Label>
                                            <Input id="duration" type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} placeholder="Ex: 30" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="insurance">Convênio (opcional)</Label>
                                        <Input id="insurance" placeholder="Nome do convênio do paciente" value={insuranceProvider} onChange={(e) => setInsuranceProvider(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="chiefComplaint">Queixa Principal (opcional)</Label>
                                        <Textarea id="chiefComplaint" placeholder="Descreva brevemente o motivo da consulta..." value={chiefComplaint} onChange={(e) => setChiefComplaint(e.target.value)} rows={2} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="patientNotes">Observações do Paciente (opcional)</Label>
                                        <Textarea id="patientNotes" placeholder="Anotações relevantes informadas pelo paciente..." value={patientNotes} onChange={(e) => setPatientNotes(e.target.value)} rows={2} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="internalNotes">Observações Internas (opcional)</Label>
                                        <Textarea id="internalNotes" placeholder="Anotações para a equipe da clínica..." value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} rows={2} />
                                    </div>

                                    <Button type="submit" className="w-full" disabled={!selectedPatient || !selectedDoctor || !selectedDate || !selectedTime || !currentUserId}>
                                        Agendar Consulta
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        {/* Card de Resumo e Informações Importantes */}
                    </div>
                </div>
            </div>
        </SecretaryLayout>
    );
}