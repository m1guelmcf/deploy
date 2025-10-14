"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DoctorLayout from "@/components/doctor-layout";
import {AvailabilityService} from "@/services/availabilityApi.mjs"

export default function AvailabilityPage() {
   const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await AvailabilityService.list();
      console.log(response);
    } catch (e: any) {
      alert(`${e?.error} ${e?.message}`);
    }
  };

  fetchData();
}, []);
    return (
        <DoctorLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Definir Disponibilidade</h1>
                        <p className="text-gray-600">Defina sua disponibilidade para consultas </p>
                    </div>
                </div>

                <form className="space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Dados </h2>

                        <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Dia Da Semana</Label>
                                    <div className="flex gap-4 mt-2 flex-nowrap">
                                        <label className="flex items-center gap-2">
                                            <input type="radio" name="sexo" value="masculino" className="text-blue-600" />
                                            <span className="whitespace-nowrap text-sm">Segunda-Feira</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="radio" name="sexo" value="feminino" className="text-blue-600" />
                                            <span className="whitespace-nowrap text-sm">Terça-Feira</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="radio" name="sexo" value="masculino" className="text-blue-600" />
                                            <span className="whitespace-nowrap text-sm">Quarta-Feira</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="radio" name="sexo" value="masculino" className="text-blue-600" />
                                            <span className="whitespace-nowrap text-sm">Quinta-Feira</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="radio" name="sexo" value="masculino" className="text-blue-600" />
                                            <span className="whitespace-nowrap text-sm">Sexta-Feira</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="radio" name="sexo" value="masculino" className="text-blue-600" />
                                            <span className="whitespace-nowrap text-sm">Sabado</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input type="radio" name="sexo" value="masculino" className="text-blue-600" />
                                            <span className="whitespace-nowrap text-sm">Domingo</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid md:grid-cols-7 gap-6">
                                <div>
                                    <Label htmlFor="horarioEntrada" className="text-sm font-medium text-gray-700">
                                        Horario De Entrada 
                                    </Label>
                                    <Input type="time" id="horarioEntrada"  required className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="horarioSaida" className="text-sm font-medium text-gray-700">
                                        Horario De Saida
                                    </Label>
                                    <Input type="time" id="horarioSaida"  required className="mt-1"  />
                                </div>
                                <div>
                                    <Label htmlFor="duracaoConsulta" className="text-sm font-medium text-gray-700">
                                        Duração Da Consulta
                                    </Label>
                                    <Input type="number" id="duracaoConsulta"  required className="mt-1" />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="modalidadeConsulta" className="text-sm font-medium text-gray-700">
                                    Modalidade De Consulta
                                </Label>
                                <Select>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="presencial ">Presencial </SelectItem>
                                        <SelectItem value="telemedicina">Telemedicina</SelectItem>
                                    
                                    </SelectContent>
                                </Select>
                            </div>
                            
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Link href="/doctor/medicos">
                            <Button variant="outline">Cancelar</Button>
                        </Link>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700">
                            Salvar Disponibilidade 
                        </Button>
                    </div>
                </form>
            </div>
        </DoctorLayout>
    );
}
