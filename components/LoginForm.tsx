// Caminho: components/LoginForm.tsx
"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { cn } from "@/lib/utils";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { apikey } from "@/services/api.mjs";


import { useToast } from "@/hooks/use-toast";


import { Eye, EyeOff, Mail, Lock, Loader2, UserCheck, Stethoscope, IdCard, Receipt } from "lucide-react";

interface LoginFormProps {
    title: string;
    description: string;
    role: "secretary" | "doctor" | "patient" | "admin" | "manager" | "finance";
    themeColor: "blue" | "green" | "orange";
    redirectPath: string;
    children?: React.ReactNode;
}

interface FormState {
    email: string;
    password: string;
}

// Supondo que o payload do seu token tenha esta estrutura
interface DecodedToken {
    name: string;
    email: string;
    role: string;
    exp: number;
    // Adicione outros campos que seu token possa ter
}

const themeClasses = {
    blue: {
        iconBg: "bg-blue-100",
        iconText: "text-blue-600",
        button: "bg-blue-600 hover:bg-blue-700",
        link: "text-blue-600 hover:text-blue-700",
        focus: "focus:border-blue-500 focus:ring-blue-500",
    },
    green: {
        iconBg: "bg-green-100",
        iconText: "text-green-600",
        button: "bg-green-600 hover:bg-green-700",
        link: "text-green-600 hover:text-green-700",
        focus: "focus:border-green-500 focus:ring-green-500",
    },
    orange: {
        iconBg: "bg-orange-100",
        iconText: "text-orange-600",
        button: "bg-orange-600 hover:bg-orange-700",
        link: "text-orange-600 hover:text-orange-700",
        focus: "focus:border-orange-500 focus:ring-orange-500",
    },
};

const roleIcons = {
    secretary: UserCheck,
    patient: Stethoscope,
    doctor: Stethoscope,
    admin: UserCheck,
    manager: IdCard,
    finance: Receipt,
};

export function LoginForm({ title, description, role, themeColor, redirectPath, children }: LoginFormProps) {
    const [form, setForm] = useState<FormState>({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const currentTheme = themeClasses[themeColor];
    const Icon = roleIcons[role];

    // ==================================================================
    // AJUSTE PRINCIPAL NA LÓGICA DE LOGIN
    // ==================================================================
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const LOGIN_URL = "https://yuanqfswhberkoevtmfr.supabase.co/auth/v1/token?grant_type=password";
        const API_KEY = apikey;

        if (!API_KEY) {
            toast({
                title: "Erro de Configuração",
                description: "A chave da API não foi encontrada.",
            });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(LOGIN_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    apikey: API_KEY,
                },
                body: JSON.stringify({ email: form.email, password: form.password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error_description || "Credenciais inválidas. Tente novamente.");
            }

            const accessToken = data.access_token;
            const user = data.user;

            /* =================== Verificação de Role Desativada Temporariamente =================== */
            // if (user.user_metadata.role !== role) {
            //   toast({ title: "Acesso Negado", ... });
            //   return;
            // }
            /* ===================================================================================== */

            Cookies.set("access_token", accessToken, { expires: 1, secure: true });
            localStorage.setItem("user_info", JSON.stringify(user));

            toast({
                title: "Login bem-sucedido!",
                description: `Bem-vindo(a), ${user.user_metadata.full_name || "usuário"}! Redirecionando...`,
            });

            router.push(redirectPath);
        } catch (error) {
            toast({
                title: "Erro no Login",
                description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // O JSX do return permanece exatamente o mesmo, preservando seus ajustes.
    return (
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4 pb-8">
                <div className={cn("mx-auto w-16 h-16 rounded-full flex items-center justify-center", currentTheme.iconBg)}>
                    <Icon className={cn("w-8 h-8", currentTheme.iconText)} />
                </div>
                <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">{title}</CardTitle>
                    <CardDescription className="text-gray-600 mt-2">{description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Inputs e Botão */}
                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input id="email" type="email" placeholder="seu.email@clinica.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={cn("pl-11 h-12 border-slate-200", currentTheme.focus)} required disabled={isLoading} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input id="password" type={showPassword ? "text" : "password"} placeholder="Digite sua senha" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={cn("pl-11 pr-12 h-12 border-slate-200", currentTheme.focus)} required disabled={isLoading} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-gray-600" disabled={isLoading}>
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <Button type="submit" className={cn("w-full h-12 text-base font-semibold", currentTheme.button)} disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar"}
                    </Button>
                </form>
                {/* Conteúdo Extra (children) */}
                <div className="mt-8">
                    {children ? (
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-slate-500">Novo por aqui?</span>
                                </div>
                            </div>
                            {children}
                        </div>
                    ) : (
                        <>
                            <div className="relative">
                                <Separator className="my-6" />
                                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-gray-500">ou</span>
                            </div>
                            <div className="text-center">
                                <Link href="/" className={cn("text-sm font-medium hover:underline", currentTheme.link)}>
                                    Voltar à página inicial
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
