"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Loader2 } from "lucide-react" 
import ManagerLayout from "@/components/manager-layout"

// Mock user service for demonstration. Replace with your actual API service.
const usersService = {
  create: async (payload: any) => {
    console.log("API Call: Creating user with payload:", payload);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate a success response
    return { id: Date.now(), ...payload };
    // To simulate an error, you could throw an error here:
    // throw new Error("O e-mail informado já está em uso.");
  }
};

// Define the structure for our form data
interface UserFormData {
  email: string;
  password: string;
  nomeCompleto: string;
  telefone: string;
  papel: string; // e.g., 'admin', 'gestor', 'medico', etc.
}

// Define the initial state for the form
const defaultFormData: UserFormData = {
  email: '',
  password: '',
  nomeCompleto: '',
  telefone: '',
  papel: '',
};

// Helper function to remove non-digit characters
const cleanNumber = (value: string): string => value.replace(/\D/g, '');

// Helper function to format a phone number
const formatPhone = (value: string): string => {
    const cleaned = cleanNumber(value).substring(0, 11);
    if (cleaned.length > 10) {
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
};

export default function NovoUsuarioPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<UserFormData>(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handles changes in form inputs
  const handleInputChange = (key: keyof UserFormData, value: string) => {
    const updatedValue = key === 'telefone' ? formatPhone(value) : value;
    setFormData((prev) => ({ ...prev, [key]: updatedValue }));
  };

  // Handles form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!formData.email || !formData.password || !formData.nomeCompleto || !formData.papel) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSaving(true);

    // Prepare payload for the API
    const payload = {
      email: formData.email,
      password: formData.password,
      full_name: formData.nomeCompleto,
      phone: formData.telefone.trim() || null, // Send null if empty
      role: formData.papel,
    };

    try {
      await usersService.create(payload); 
      // On success, redirect to the main user list page
      router.push("/manager/usuario"); 
    } catch (e: any) {
      console.error("Erro ao criar usuário:", e);
      setError(e.message || "Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ManagerLayout>
      <div className="w-full max-w-2xl mx-auto space-y-6 p-4 md:p-8"> 
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Novo Usuário</h1>
            <p className="text-sm text-gray-500">
              Preencha os dados para cadastrar um novo usuário no sistema.
            </p>
          </div>
          <Link href="/manager/usuario">
            <Button variant="outline">Cancelar</Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 border rounded-lg shadow-sm">
          
          {/* Error Message Display */}
          {error && (
               <div className="p-3 bg-red-100 text-red-700 rounded-lg border border-red-300">
                   <p className="font-medium">Erro no Cadastro:</p>
                   <p className="text-sm">{error}</p>
              </div>
          )}
            
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomeCompleto">Nome Completo *</Label>
              <Input
                id="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={(e) => handleInputChange("nomeCompleto", e.target.value)}
                placeholder="Nome e Sobrenome"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="exemplo@dominio.com"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Senha *</Label>
                    <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        placeholder="••••••••"
                        required
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                        id="telefone"
                        value={formData.telefone}
                        onChange={(e) => handleInputChange("telefone", e.target.value)}
                        placeholder="(00) 00000-0000"
                        maxLength={15}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="papel">Papel (Função) *</Label>
                    <Select value={formData.papel} onValueChange={(v) => handleInputChange("papel", v)} required>
                        <SelectTrigger id="papel">
                        <SelectValue placeholder="Selecione uma função" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="gestor">Gestor</SelectItem>
                            <SelectItem value="secretaria">Secretaria</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Link href="/manager/usuario">
              <Button type="button" variant="outline" disabled={isSaving}>
                Cancelar
              </Button>
            </Link>
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700"
              disabled={isSaving}
            >
              {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                  <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? "Salvando..." : "Salvar Usuário"}
            </Button>
          </div>
        </form>
      </div>
    </ManagerLayout>
  );
}