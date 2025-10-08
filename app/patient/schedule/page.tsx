"use client"

import type React from "react"
import { useState } from "react"
// Importações de componentes omitidas para brevidade, mas estão no código original
import PatientLayout from "@/components/patient-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, User } from "lucide-react"

// Chave do LocalStorage, a mesma usada em secretarypage.tsx
const APPOINTMENTS_STORAGE_KEY = "clinic-appointments";

export default function ScheduleAppointment() {
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [notes, setNotes] = useState("")

  const doctors = [
    { id: "1", name: "Dr. João Silva", specialty: "Cardiologia" },
    { id: "2", name: "Dra. Maria Santos", specialty: "Dermatologia" },
    { id: "3", name: "Dr. Pedro Costa", specialty: "Ortopedia" },
    { id: "4", name: "Dra. Ana Lima", specialty: "Ginecologia" },
  ]

  const availableTimes = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const doctorDetails = doctors.find((d) => d.id === selectedDoctor)
    
    // --- SIMULAÇÃO DO PACIENTE LOGADO ---
    // Você só tem um usuário para cada role. Vamos simular um paciente:
    const patientDetails = { 
        id: "P001", 
        full_name: "Paciente Exemplo Único", // Este nome aparecerá na agenda do médico
        location: "Clínica Geral",
        phone: "(11) 98765-4321" 
    }; 

    if (!patientDetails || !doctorDetails) {
        alert("Erro: Selecione o médico ou dados do paciente indisponíveis.");
        return;
    }

    const newAppointment = {
        id: new Date().getTime(), // ID único simples
        patientName: patientDetails.full_name,
        doctor: doctorDetails.name, // Nome completo do médico (necessário para a listagem)
        specialty: doctorDetails.specialty,
        date: selectedDate,
        time: selectedTime,
        status: "agendada",
        phone: patientDetails.phone, 
    };

    // 1. Carrega agendamentos existentes
    const storedAppointmentsRaw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    const currentAppointments = storedAppointmentsRaw ? JSON.parse(storedAppointmentsRaw) : [];
    
    // 2. Adiciona o novo agendamento
    const updatedAppointments = [...currentAppointments, newAppointment];

    // 3. Salva a lista atualizada no LocalStorage
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updatedAppointments));

    alert(`Consulta com ${doctorDetails.name} agendada com sucesso!`);
    
    // Limpar o formulário após o sucesso (opcional)
    setSelectedDoctor("");
    setSelectedDate("");
    setSelectedTime("");
    setNotes("");
  }

  return (
    <PatientLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agendar Consulta</h1>
          <p className="text-gray-600">Escolha o médico, data e horário para sua consulta</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Dados da Consulta</CardTitle>
                <CardDescription>Preencha as informações para agendar sua consulta</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="doctor">Médico</Label>
                    <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um médico" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            {doctor.name} - {doctor.specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Data</Label>
                      <Input
                        id="date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
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
                    <Textarea
                      id="notes"
                      placeholder="Descreva brevemente o motivo da consulta ou observações importantes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={!selectedDoctor || !selectedDate || !selectedTime}>
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
                {selectedDoctor && (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{doctors.find((d) => d.id === selectedDoctor)?.name}</span>
                  </div>
                )}

                {selectedDate && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{new Date(selectedDate).toLocaleDateString("pt-BR")}</span>
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
    </PatientLayout>
  )
}