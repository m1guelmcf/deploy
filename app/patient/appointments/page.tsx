"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useAppointments, Appointment } from "../../context/AppointmentsContext";

// Componentes de UI e Ícones
import PatientLayout from "@/components/patient-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Phone, CalendarDays, X, Trash2 } from "lucide-react";

export default function PatientAppointmentsPage() {
    const { appointments, updateAppointment, deleteAppointment } = useAppointments();

    // Estados para controlar os modais e os dados do formulário
    const [isRescheduleModalOpen, setRescheduleModalOpen] = useState(false);
    const [isCancelModalOpen, setCancelModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    
    const [rescheduleData, setRescheduleData] = useState({ date: "", time: "", reason: "" });
    const [cancelReason, setCancelReason] = useState("");

    // --- MANIPULADORES DE EVENTOS ---

    const handleRescheduleClick = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        // Preenche o formulário com os dados atuais da consulta
        setRescheduleData({ date: appointment.date, time: appointment.time, reason: appointment.observations || "" });
        setRescheduleModalOpen(true);
    };

    const handleCancelClick = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setCancelReason(""); // Limpa o motivo ao abrir
        setCancelModalOpen(true);
    };
    
    const confirmReschedule = () => {
        if (!rescheduleData.date || !rescheduleData.time) {
            toast.error("Por favor, selecione uma nova data e horário");
            return;
        }
        if (selectedAppointment) {
            updateAppointment(selectedAppointment.id, {
                date: rescheduleData.date,
                time: rescheduleData.time,
                observations: rescheduleData.reason, // Atualiza as observações com o motivo
            });
            toast.success("Consulta reagendada com sucesso!");
            setRescheduleModalOpen(false);
        }
    };

    const confirmCancel = () => {
        if (cancelReason.trim().length < 10) {
            toast.error("Por favor, forneça um motivo com pelo menos 10 caracteres.");
            return;
        }
        if (selectedAppointment) {
            // Apenas atualiza o status e adiciona o motivo do cancelamento nas observações
            updateAppointment(selectedAppointment.id, { 
                status: "Cancelada",
                observations: `Motivo do cancelamento: ${cancelReason}`
            });
            toast.success("Consulta cancelada com sucesso!");
            setCancelModalOpen(false);
        }
    };

    const handleDeleteClick = (appointmentId: string) => {
        if (window.confirm("Tem certeza que deseja excluir permanentemente esta consulta? Esta ação não pode ser desfeita.")) {
            deleteAppointment(appointmentId);
            toast.success("Consulta excluída do histórico.");
        }
    };

    // --- LÓGICA AUXILIAR ---
    
    const getStatusBadge = (status: Appointment['status']) => {
        switch (status) {
            case "Agendada": return <Badge className="bg-blue-100 text-blue-800 font-medium">Agendada</Badge>;
            case "Realizada": return <Badge className="bg-green-100 text-green-800 font-medium">Realizada</Badge>;
            case "Cancelada": return <Badge className="bg-red-100 text-red-800 font-medium">Cancelada</Badge>;
        }
    };

    const timeSlots = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "14:00", "14:30", "15:00", "15:30"];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera o horário para comparar apenas o dia

    // ETAPA 1: ORDENAÇÃO DAS CONSULTAS
    // Cria uma cópia do array e o ordena
    const sortedAppointments = [...appointments].sort((a, b) => {
        const statusWeight = { 'Agendada': 1, 'Realizada': 2, 'Cancelada': 3 };
        
        // Primeiro, ordena por status (Agendada vem primeiro)
        if (statusWeight[a.status] !== statusWeight[b.status]) {
            return statusWeight[a.status] - statusWeight[b.status];
        }

        // Se o status for o mesmo, ordena por data (mais recente/futura no topo)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return (
        <PatientLayout>
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Minhas Consultas</h1>
                        <p className="text-gray-600">Histórico e consultas agendadas</p>
                    </div>
                    <Link href="/patient/schedule">
                        <Button className="bg-gray-800 hover:bg-gray-900 text-white">
                            <Calendar className="mr-2 h-4 w-4" />
                            Agendar Nova Consulta
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6">
                    {/* Utiliza o array ORDENADO para a renderização */}
                    {sortedAppointments.map((appointment) => {
                        const appointmentDate = new Date(appointment.date);
                        let displayStatus = appointment.status;

                        if (appointment.status === 'Agendada' && appointmentDate < today) {
                            displayStatus = 'Realizada';
                        }
                        
                        return (
                            <Card key={appointment.id} className="overflow-hidden">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl">{appointment.doctorName}</CardTitle>
                                            <CardDescription>{appointment.specialty}</CardDescription>
                                        </div>
                                        {getStatusBadge(displayStatus)}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center text-sm text-gray-700">
                                                <Calendar className="mr-3 h-4 w-4 text-gray-500" />
                                                {new Date(appointment.date).toLocaleDateString("pt-BR", { timeZone: 'UTC' })}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-700">
                                                <Clock className="mr-3 h-4 w-4 text-gray-500" />
                                                {appointment.time}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center text-sm text-gray-700">
                                                <MapPin className="mr-3 h-4 w-4 text-gray-500" />
                                                {appointment.location || 'Local não informado'}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-700">
                                                <Phone className="mr-3 h-4 w-4 text-gray-500" />
                                                {appointment.phone || 'Telefone não informado'}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Container ÚNICO para todas as ações */}
                                    <div className="flex gap-2 pt-4 border-t">
                                      {(displayStatus === "Agendada") && (
                                        <>
                                          <Button variant="outline" size="sm" onClick={() => handleRescheduleClick(appointment)}>
                                            <CalendarDays className="mr-2 h-4 w-4" />
                                            Reagendar
                                          </Button>
                                          <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50" onClick={() => handleCancelClick(appointment)}>
                                            <X className="mr-2 h-4 w-4" />
                                            Cancelar
                                          </Button>
                                        </>
                                      )}

                                      {(displayStatus === "Realizada" || displayStatus === "Cancelada") && (
                                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteClick(appointment.id)}>
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Excluir do Histórico
                                        </Button>
                                      )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
            
            {/* ETAPA 2: CONSTRUÇÃO DOS MODAIS */}

            {/* Modal de Reagendamento */}
            <Dialog open={isRescheduleModalOpen} onOpenChange={setRescheduleModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reagendar Consulta</DialogTitle>
                        <DialogDescription>
                            Reagendar consulta com {selectedAppointment?.doctorName}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">Nova Data</Label>
                            <Input 
                                id="date" 
                                type="date" 
                                value={rescheduleData.date}
                                onChange={(e) => setRescheduleData({...rescheduleData, date: e.target.value})}
                                className="col-span-3" 
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="time" className="text-right">Novo Horário</Label>
                            <Select 
                                value={rescheduleData.time}
                                onValueChange={(value) => setRescheduleData({...rescheduleData, time: value})}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecione um horário" />
                                </SelectTrigger>
                                <SelectContent>
                                    {timeSlots.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="reason" className="text-right">Motivo</Label>
                            <Textarea 
                                id="reason" 
                                placeholder="Informe o motivo do reagendamento (opcional)"
                                value={rescheduleData.reason}
                                onChange={(e) => setRescheduleData({...rescheduleData, reason: e.target.value})}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button type="button" onClick={confirmReschedule}>Confirmar Reagendamento</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de Cancelamento */}
            <Dialog open={isCancelModalOpen} onOpenChange={setCancelModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancelar Consulta</DialogTitle>
                        <DialogDescription>
                            Você tem certeza que deseja cancelar sua consulta com {selectedAppointment?.doctorName}? Esta ação não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="cancelReason">Motivo do Cancelamento (obrigatório)</Label>
                        <Textarea 
                            id="cancelReason" 
                            placeholder="Por favor, descreva o motivo do cancelamento..."
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            className="mt-2"
                        />
                    </div>
                    <DialogFooter>
                         <DialogClose asChild>
                            <Button type="button" variant="outline">Voltar</Button>
                        </DialogClose>
                        <Button type="button" variant="destructive" onClick={confirmCancel}>Confirmar Cancelamento</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PatientLayout>
    );
}