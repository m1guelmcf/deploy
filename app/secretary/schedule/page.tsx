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
import { doctorsService } from "@/services/doctorsApi.mjs"; // Importar o serviço de médicos
import { toast } from "sonner";

const APPOINTMENTS_STORAGE_KEY = "clinic-appointments";

export default function ScheduleAppointment() {
    const router = useRouter();
    const [patients, setPatients] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]); // Estado para armazenar os médicos da API
    const [selectedPatient, setSelectedPatient] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Carrega pacientes e médicos em paralelo para melhor performance
                const [patientList, doctorList] = await Promise.all([
                    patientsService.list(),
                    doctorsService.list()
                ]);
                setPatients(patientList);
                setDoctors(doctorList);
            } catch (error) {
                console.error("Falha ao buscar dados iniciais:", error);
                toast.error("Não foi possível carregar os dados de pacientes e médicos.");
            }
        };
        fetchData();
    }, []);

    const availableTimes = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const patientDetails = patients.find((p) => String(p.id) === selectedPatient);
        const doctorDetails = doctors.find((d) => String(d.id) === selectedDoctor);

        if (!patientDetails || !doctorDetails) {
            toast.error("Erro ao encontrar detalhes do paciente ou médico.");
            return;
        }

        const newAppointment = {
            id: new Date().getTime(), // ID único simples
            patientName: patientDetails.full_name,
            doctor: doctorDetails.full_name, // Usar full_name para consistência
            specialty: doctorDetails.specialty,
            date: selectedDate,
            time: selectedTime,
            status: "agendada",
            location: doctorDetails.location || "Consultório a definir", // Fallback
            phone: doctorDetails.phone || "N/A", // Fallback
        };

        const storedAppointmentsRaw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
        const currentAppointments = storedAppointmentsRaw ? JSON.parse(storedAppointmentsRaw) : [];
        const updatedAppointments = [...currentAppointments, newAppointment];

        localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updatedAppointments));

        toast.success("Consulta agendada com sucesso!");
        router.push("/secretary/appointments");
    };

    return (
        <SecretaryLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Agendar Consulta</h1>
                    <p className="text-gray-600">Escolha o paciente, médico, data e horário para a consulta</p>
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
                                    <div className="space-y-2">
                                        <Label htmlFor="patient">Paciente</Label>
                                        <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione um paciente" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {patients.length > 0 ? (
                                                    patients.map((patient) => (
                                                        <SelectItem key={patient.id} value={String(patient.id)}>
                                                            {patient.full_name}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="loading" disabled>
                                                        Carregando pacientes...
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="doctor">Médico</Label>
                                        <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione um médico" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {doctors.length > 0 ? (
                                                    doctors.map((doctor) => (
                                                        <SelectItem key={doctor.id} value={String(doctor.id)}>
                                                            {doctor.full_name} - {doctor.specialty}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="loading" disabled>
                                                        Carregando médicos...
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
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

                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Observações (opcional)</Label>
                                        <Textarea id="notes" placeholder="Descreva brevemente o motivo da consulta ou observações importantes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
                                    </div>

                                    <Button type="submit" className="w-full" disabled={!selectedPatient || !selectedDoctor || !selectedDate || !selectedTime}>
                                        Agendar Consulta
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Calendar className="mr-2 h-5 w-5" />
                                    Resumo
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {selectedPatient && (
                                    <div className="flex items-start space-x-2">
                                        <User className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                                        <div className="text-sm">
                                            <span className="font-semibold text-gray-800">Paciente:</span>
                                            <p className="text-gray-600">{patients.find((p) => String(p.id) === selectedPatient)?.full_name}</p>
                                        </div>
                                    </div>
                                )}

                                {selectedDoctor && (
                                    <div className="flex items-start space-x-2">
                                        <User className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                                        <div className="text-sm">
                                            <span className="font-semibold text-gray-800">Médico:</span>
                                            <p className="text-gray-600">{doctors.find((d) => String(d.id) === selectedDoctor)?.full_name}</p>
                                        </div>
                                    </div>
                                )}

                                {selectedDate && (
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm">{new Date(selectedDate).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</span>
                                    </div>
                                )}

                                {selectedTime && (
                                    <div className="flex items-center space-x-2">
                                        <Clock className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm">{selectedTime}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Informações Importantes</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-gray-600 space-y-2">
                                <p>• Chegue com 15 minutos de antecedência</p>
                                <p>• Traga documento com foto</p>
                                <p>• Traga carteirinha do convênio</p>
                                <p>• Traga exames anteriores, se houver</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </SecretaryLayout>
    );
}
