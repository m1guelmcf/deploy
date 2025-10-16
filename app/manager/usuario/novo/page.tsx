"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Loader2 } from "lucide-react";
import ManagerLayout from "@/components/manager-layout";
import { usersService } from "services/usersApi.mjs";
import { login } from "services/api.mjs";

// Adicionada a propriedade 'senha' e 'confirmarSenha'
interface UserFormData {
  email: string;
  nomeCompleto: string;
  telefone: string;
  papel: string;
  senha: string;
  confirmarSenha: string; // Novo campo para confirmação
}

const defaultFormData: UserFormData = {
  email: "",
  nomeCompleto: "",
  telefone: "",
  papel: "",
  senha: "",
  confirmarSenha: "",
};

// Funções de formatação de telefone
const cleanNumber = (value: string): string => value.replace(/\D/g, "");
const formatPhone = (value: string): string => {
  const cleaned = cleanNumber(value).substring(0, 11);
  if (cleaned.length === 11)
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  if (cleaned.length === 10)
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  return cleaned;
};

export default function NovoUsuarioPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<UserFormData>(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (key: keyof UserFormData, value: string) => {
    const updatedValue = key === "telefone" ? formatPhone(value) : value;
    setFormData((prev) => ({ ...prev, [key]: updatedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validação de campos obrigatórios
    if (!formData.email || !formData.nomeCompleto || !formData.papel || !formData.senha || !formData.confirmarSenha) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Validação de senhas
    if (formData.senha !== formData.confirmarSenha) {
      setError("A Senha e a Confirmação de Senha não coincidem.");
      return;
    }

    setIsSaving(true);

    try {
      await login();

      const payload = {
        full_name: formData.nomeCompleto,
        email: formData.email.trim().toLowerCase(),
        phone: formData.telefone || null,
        role: formData.papel,
        password: formData.senha, // Senha adicionada
      };

      console.log("📤 Enviando payload:", payload);
      await usersService.create_user(payload);

      router.push("/manager/usuario");
    } catch (e: any) {
      console.error("Erro ao criar usuário:", e);
      const msg =
        e.message ||
        "Não foi possível criar o usuário. Verifique os dados e tente novamente.";
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ManagerLayout>
      {/* Container principal: w-full e centralizado. max-w-screen-lg para evitar expansão excessiva */}
      <div className="w-full h-full p-4 md:p-8 flex justify-center items-start">
        <div className="w-full max-w-screen-lg space-y-8">
          
          {/* Cabeçalho */}
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Novo Usuário</h1>
              <p className="text-md text-gray-500">
                Preencha os dados para cadastrar um novo usuário no sistema.
              </p>
            </div>
            <Link href="/manager/usuario">
              <Button variant="outline">Cancelar</Button>
            </Link>
          </div>

          {/* Formulário */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-6 md:p-10 border rounded-xl shadow-lg"
          >
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-300">
                <p className="font-semibold">Erro no Cadastro:</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Campos de Entrada - Usando Grid de 2 colunas para organização */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Nome Completo - Largura total */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                <Input
                  id="nomeCompleto"
                  value={formData.nomeCompleto}
                  onChange={(e) =>
                    handleInputChange("nomeCompleto", e.target.value)
                  }
                  placeholder="Nome e Sobrenome"
                  required
                />
              </div>

              {/* E-mail (Coluna 1) */}
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

              {/* Papel (Função) (Coluna 2) */}
              <div className="space-y-2">
                <Label htmlFor="papel">Papel (Função) *</Label>
                <Select
                  value={formData.papel}
                  onValueChange={(v) => handleInputChange("papel", v)}
                  required
                >
                  <SelectTrigger id="papel">
                    <SelectValue placeholder="Selecione uma função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="gestor">Gestor</SelectItem>
                    <SelectItem value="medico">Médico</SelectItem>
                    <SelectItem value="secretaria">Secretária</SelectItem>
                    <SelectItem value="user">Usuário</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Senha (Coluna 1) */}
              <div className="space-y-2">
                <Label htmlFor="senha">Senha *</Label>
                <Input
                  id="senha"
                  type="password"
                  value={formData.senha}
                  onChange={(e) => handleInputChange("senha", e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  minLength={8} 
                  required
                />
              </div>

              {/* Confirmar Senha (Coluna 2) */}
              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
                <Input
                  id="confirmarSenha"
                  type="password"
                  value={formData.confirmarSenha}
                  onChange={(e) => handleInputChange("confirmarSenha", e.target.value)}
                  placeholder="Repita a senha"
                  required
                />
                {formData.senha && formData.confirmarSenha && formData.senha !== formData.confirmarSenha && (
                    <p className="text-xs text-red-500">As senhas não coincidem.</p>
                )}
              </div>
              
              {/* Telefone (Opcional, mas mantido no grid) */}
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) =>
                    handleInputChange("telefone", e.target.value)
                  }
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                />
              </div>

            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end gap-4 pt-6 border-t mt-6">
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
      </div>
    </ManagerLayout>
  );
}