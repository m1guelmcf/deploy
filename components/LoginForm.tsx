// Caminho: components/LoginForm.tsx
"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Nossos serviços de API centralizados
import { loginWithEmailAndPassword, api } from "@/services/api.mjs";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";



import { useToast } from "@/hooks/use-toast";


import { Eye, EyeOff, Mail, Lock, Loader2, UserCheck, Stethoscope, IdCard, Receipt } from "lucide-react";

interface LoginFormProps {
  children?: React.ReactNode
}

interface FormState {
  email: string
  password: string
}

export function LoginForm({ children }: LoginFormProps) {
  const [form, setForm] = useState<FormState>({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // ==================================================================
  // LÓGICA DE LOGIN INTELIGENTE E CENTRALIZADA
  // ==================================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    localStorage.removeItem("token");
    localStorage.removeItem("user_info");

    try {
        const authData = await loginWithEmailAndPassword(form.email, form.password);
        const user = authData.user;
        if (!user || !user.id) {
            throw new Error("Resposta de autenticação inválida: ID do usuário não encontrado.");
        }

        const rolesData = await api.get(`/rest/v1/user_roles?user_id=eq.${user.id}&select=role`);

        if (!rolesData || rolesData.length === 0) {
            throw new Error("Login bem-sucedido, mas nenhum perfil de acesso foi encontrado para este usuário.");
        }

        const userRole = rolesData[0].role;
        const completeUserInfo = { ...user, user_metadata: { ...user.user_metadata, role: userRole } };
        localStorage.setItem('user_info', JSON.stringify(completeUserInfo));

        let redirectPath = "";
        switch (userRole) {
            case "admin":
            case "manager": redirectPath = "/manager/home"; break;
            case "medico": redirectPath = "/doctor/medicos"; break;
            case "secretary": redirectPath = "/secretary/pacientes"; break;
            case "patient": redirectPath = "/patient/dashboard"; break;
            case "finance": redirectPath = "/finance/home"; break;
        }

        if (!redirectPath) {
            throw new Error(`O perfil de acesso '${userRole}' não é válido para login. Contate o suporte.`);
        }
        
        toast({
            title: "Login bem-sucedido!",
            description: `Bem-vindo(a)! Redirecionando...`,
        });
        
        router.push(redirectPath);

    } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user_info");
        
        console.error("ERRO DETALHADO NO CATCH:", error);

        toast({
            title: "Erro no Login",
            description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
        });
    } finally {
        setIsLoading(false);
    }
  }

  // ==================================================================
  // JSX VISUALMENTE RICO E UNIFICADO
  // ==================================================================
  return (
    // Usamos Card e CardContent para manter a consistência, mas o estilo principal
    // virá da página 'app/login/page.tsx' que envolve este componente.
    <Card className="w-full bg-transparent border-0 shadow-none">
      <CardContent className="p-0"> {/* Removemos o padding para dar controle à página pai */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                id="email" 
                type="email" 
                placeholder="seu.email@exemplo.com" 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
                className="pl-10 h-11" 
                required 
                disabled={isLoading}
                autoComplete="username" // Boa prática de acessibilidade
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="Digite sua senha" 
                value={form.password} 
                onChange={(e) => setForm({ ...form, password: e.target.value })} 
                className="pl-10 pr-12 h-11" 
                required 
                disabled={isLoading}
                autoComplete="current-password" // Boa prática de acessibilidade
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground" disabled={isLoading}>
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar"}
          </Button>
        </form>

        {/* O children permite que a página de login adicione links extras aqui */}
        {children}
      </CardContent>
    </Card>
  )
}