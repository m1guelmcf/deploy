"use client";

import { useState, useEffect } from "react";
import SecretaryLayout from "@/components/secretary-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Phone, CalendarDays, X, User } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const APPOINTMENTS_STORAGE_KEY = "clinic-appointments";

const initialAppointments = [
    {
        id: 1,
        patientName: "Carlos Pereira",
        doctor: "Dr. João Silva",
        specialty: "Cardiologia",
        date: "2024-01-15",
        time: "14:30",
        status: "agendada",
        location: "Consultório A - 2º andar",
        phone: "(11) 3333-4444",
    },
    {
        id: 2,
        patientName: "Ana Beatriz Costa",
        doctor: "Dra. Maria Santos",
        specialty: "Dermatologia",
        date: "2024-01-22",
        time: "10:00",
        status: "agendada",
        location: "Consultório B - 1º andar",
        phone: "(11) 3333-5555",
    },
    {
        id: 3,
        patientName: "Roberto Almeida",
        doctor: "Dr. Pedro Costa",
        specialty: "Ortopedia",
        date: "2024-01-08",
        time: "16:00",
        status: "realizada",
        location: "Consultório C - 3º andar",
        phone: "(11) 3333-6666",
    },
    {
        id: 4,
        patientName: "Fernanda Lima",
        doctor: "Dra. Ana Lima",
        specialty: "Ginecologia",
        date: "2024-01-05",
        time: "09:30",
        status: "realizada",
        location: "Consultório D - 2º andar",
        phone: "(11) 3333-7777",
    },
];

export default function SecretaryAppointments() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [rescheduleModal, setRescheduleModal] = useState(false);
    const [cancelModal, setCancelModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [rescheduleData, setRescheduleData] = useState({ date: "", time: "", reason: "" });
    const [cancelReason, setCancelReason] = useState("");

    useEffect(() => {
        const storedAppointments = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
        if (storedAppointments) {
            setAppointments(JSON.parse(storedAppointments));
        } else {
            setAppointments(initialAppointments);
            localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(initialAppointments));
        }
    }, []);

    const updateAppointments = (updatedAppointments: any[]) => {
        setAppointments(updatedAppointments);
        localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updatedAppointments));
    };

    const handleReschedule = (appointment: any) => {
        setSelectedAppointment(appointment);
        setRescheduleData({ date: "", time: "", reason: "" });
        setRescheduleModal(true);
    };

    const handleCancel = (appointment: any) => {
        setSelectedAppointment(appointment);
        setCancelReason("");
        setCancelModal(true);
    };

    const confirmReschedule = () => {
        if (!rescheduleData.date || !rescheduleData.time) {
            toast.error("Por favor, selecione uma nova data e horário");
            return;
        }
        const updated = appointments.map((apt) => (apt.id === selectedAppointment.id ? { ...apt, date: rescheduleData.date, time: rescheduleData.time } : apt));
        updateAppointments(updated);
        setRescheduleModal(false);
        toast.success("Consulta reagendada com sucesso!");
    };

    const confirmCancel = () => {
        if (!cancelReason.trim() || cancelReason.trim().length < 10) {
            toast.error("O motivo do cancelamento é obrigatório e deve ter no mínimo 10 caracteres.");
            return;
        }
        const updated = appointments.map((apt) => (apt.id === selectedAppointment.id ? { ...apt, status: "cancelada" } : apt));
        updateAppointments(updated);
        setCancelModal(false);
        toast.success("Consulta cancelada com sucesso!");
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "agendada":
                return <Badge className="bg-blue-100 text-blue-800">Agendada</Badge>;
            case "realizada":
                return <Badge className="bg-green-100 text-green-800">Realizada</Badge>;
            case "cancelada":
                return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const timeSlots = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];

    return (
        <SecretaryLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Consultas Agendadas</h1>
                        <p className="text-gray-600">Gerencie as consultas dos pacientes</p>
                    </div>
                    <Link href="/secretary/schedule">
                        <Button>
                            <Calendar className="mr-2 h-4 w-4" />
                            Agendar Nova Consulta
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6">
                    {appointments.length > 0 ? (
                        appointments.map((appointment) => (
                            <Card key={appointment.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg">{appointment.doctor}</CardTitle>
                                            <CardDescription>{appointment.specialty}</CardDescription>
                                        </div>
                                        {getStatusBadge(appointment.status)}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center text-sm text-gray-800 font-medium">
                                                <User className="mr-2 h-4 w-4 text-gray-600" />
                                                {appointment.patientName}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Calendar className="mr-2 h-4 w-4" />
                                                {new Date(appointment.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Clock className="mr-2 h-4 w-4" />
                                                {appointment.time}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <MapPin className="mr-2 h-4 w-4" />
                                                {appointment.location}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Phone className="mr-2 h-4 w-4" />
                                                {appointment.phone}
                                            </div>
                                        </div>
                                    </div>

                                    {appointment.status === "agendada" && (
                                        <div className="flex gap-2 mt-4 pt-4 border-t">
                                            <Button variant="outline" size="sm" onClick={() => handleReschedule(appointment)}>
                                                <CalendarDays className="mr-2 h-4 w-4" />
                                                Reagendar
                                            </Button>
                                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent" onClick={() => handleCancel(appointment)}>
                                                <X className="mr-2 h-4 w-4" />
                                                Cancelar
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p>Nenhuma consulta encontrada.</p>
                    )}
                </div>
            </div>

            <Dialog open={rescheduleModal} onOpenChange={setRescheduleModal}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Reagendar Consulta</DialogTitle>
                        <DialogDescription>Reagendar consulta com {selectedAppointment?.doctor} para {selectedAppointment?.patientName}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="date">Nova Data</Label>
                            <Input id="date" type="date" value={rescheduleData.date} onChange={(e) => setRescheduleData((prev) => ({ ...prev, date: e.target.value }))} min={new Date().toISOString().split("T")[0]} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="time">Novo Horário</Label>
                            <Select value={rescheduleData.time} onValueChange={(value) => setRescheduleData((prev) => ({ ...prev, time: value }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um horário" />
                                </SelectTrigger>
                                <SelectContent>
                                    {timeSlots.map((time) => (
                                        <SelectItem key={time} value={time}>
                                            {time}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="reason">Motivo do Reagendamento (opcional)</Label>
                            <Textarea id="reason" placeholder="Informe o motivo do reagendamento..." value={rescheduleData.reason} onChange={(e) => setRescheduleData((prev) => ({ ...prev, reason: e.target.value }))} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRescheduleModal(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={confirmReschedule}>Confirmar Reagendamento</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={cancelModal} onOpenChange={setCancelModal}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Cancelar Consulta</DialogTitle>
                        <DialogDescription>Tem certeza que deseja cancelar a consulta de {selectedAppointment?.patientName} com {selectedAppointment?.doctor}?</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="cancel-reason" className="text-sm font-medium">
                                Motivo do Cancelamento <span className="text-red-500">*</span>
                            </Label>
                            <Textarea id="cancel-reason" placeholder="Por favor, informe o motivo do cancelamento... (obrigatório)" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} required className={`min-h-[100px] ${!cancelReason.trim() && cancelModal ? "border-red-300 focus:border-red-500" : ""}`} />
                            <p className="text-xs text-gray-500">Mínimo de 10 caracteres. Este campo é obrigatório.</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCancelModal(false)}>
                            Voltar
                        </Button>
                        <Button variant="destructive" onClick={confirmCancel} disabled={!cancelReason.trim() || cancelReason.trim().length < 10}>
                            Confirmar Cancelamento
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </SecretaryLayout>
    );
}