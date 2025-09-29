"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// [SINCRONIZAÇÃO 1] - Importando a lista de 'appointments' para a validação de conflito
import { useAppointments } from "../../context/AppointmentsContext";

// Componentes de UI e Layout
import PatientLayout from "@/components/patient-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User } from "lucide-react";

// Interface para o estado local do formulário (sem alterações)
interface AppointmentFormState {
  doctorId: string;
  date: string;
  time: string;
  observations: string;
}

// --- DADOS MOCKADOS (ALTERAÇÃO 1: Adicionando location e phone) ---
const doctors = [
    { id: "1", name: "Dr. João Silva", specialty: "Cardiologia", location: "Consultório A - 2º andar", phone: "(11) 3333-4444" },
    { id: "2", name: "Dra. Maria Santos", specialty: "Dermatologia", location: "Consultório B - 1º andar", phone: "(11) 3333-5555" },
    { id: "3", name: "Dr. Pedro Costa", specialty: "Ortopedia", location: "Consultório C - 3º andar", phone: "(11) 3333-6666" },
];
const availableTimes = ["09:00", "09:30", "10:00", "10:30", "14:00", "14:30", "15:00"];
// -------------------------------------------------------------

export default function ScheduleAppointmentPage() {
  const router = useRouter();
  // [SINCRONIZAÇÃO 1 - continuação] - Obtendo a lista de agendamentos existentes
  const { addAppointment, appointments } = useAppointments();

  const [formData, setFormData] = useState<AppointmentFormState>({
    doctorId: "",
    date: "",
    time: "",
    observations: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSelectChange = (name: keyof AppointmentFormState, value: string) => {
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.doctorId || !formData.date || !formData.time) {
        toast.error("Por favor, preencha os campos de médico, data e horário.");
        return;
    }

    const selectedDoctor = doctors.find(doc => doc.id === formData.doctorId);
    if (!selectedDoctor) return;

    // Validação de conflito (sem alterações, já estava correta)
    const isConflict = appointments.some(
      (apt) =>
        apt.doctorName === selectedDoctor.name &&
        apt.date === formData.date &&
        apt.time === formData.time
    );

    if (isConflict) {
      toast.error("Este horário já está ocupado para o médico selecionado.");
      return;
    }

    // [ALTERAÇÃO 2] - Utilizando os dados do médico selecionado para location e phone
    // e removendo os placeholders.
    addAppointment({
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      date: formData.date,
      time: formData.time,
      observations: formData.observations,
      location: selectedDoctor.location, // Usando a localização do médico
      phone: selectedDoctor.phone,       // Usando o telefone do médico
    });

    toast.success("Consulta agendada com sucesso!");
    router.push('/patient/appointments');
  };

  // Validação de data passada (sem alterações, já estava correta)
  const today = new Date().toISOString().split('T')[0];

  return (
    <PatientLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agendar Consulta</h1>
          <p className="text-gray-600">Escolha o médico, data e horário para sua consulta</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                    <Select
                      value={formData.doctorId}
                      onValueChange={(value) => handleSelectChange('doctorId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleione um médico" />
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Data</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        min={today}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Horário</Label>
                      <Select
                        value={formData.time}
                        onValueChange={(value) => handleSelectChange('time', value)}
                      >
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
                    <Label htmlFor="observations">Observações (opcional)</Label>
                    <Textarea
                      id="observations"
                      name="observations"
                      placeholder="Descreva brevemente o motivo da consulta ou observações importantes"
                      value={formData.observations}
                      onChange={handleChange}
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-gray-600 hover:bg-gray-700 text-white text-base py-6">
                    Agendar Consulta
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Calendar className="mr-2 h-5 w-5" />
                  Resumo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {formData.doctorId ? (
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-gray-500" />
                    <span>{doctors.find((d) => d.id === formData.doctorId)?.name}</span>
                  </div>
                ) : <p className="text-gray-500">Preencha o formulário...</p>}
                
                {formData.date && (
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                    <span>{new Date(formData.date).toLocaleDateString("pt-BR", { timeZone: 'UTC' })}</span>
                  </div>
                )}

                {formData.time && (
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-500" />
                    <span>{formData.time}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informações Importantes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
                  <li>Chegue com 15 minutos de antecedência</li>
                  <li>Traga documento com foto</li>
                  <li>Traga carteirinha do convênio</li>
                  <li>Traga exames anteriores, se houver</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}