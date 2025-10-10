// Caminho: app/(patient)/login/page.tsx

import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PatientLoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors duration-200 font-medium">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar ao início
                    </Link>
                </div>

                <LoginForm title="Área do Paciente" description="Acesse sua conta para gerenciar consultas" role="patient" themeColor="blue" redirectPath="/patient/dashboard">
                    {/* Este bloco é passado como 'children' para o LoginForm */}
                    <Link href="/patient/register" passHref>
                        <Button variant="outline" className="w-full h-12 text-base">
                            Criar nova conta
                        </Button>
                    </Link>
                </LoginForm>

                {/* Conteúdo e espaçamento restaurados */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground">Problemas para acessar? Entre em contato conosco</p>
                </div>
            </div>
        </div>
    );
}
