"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Mail, Lock, UserCheck, Loader2 } from "lucide-react"
import Link from "next/link"

interface LoginForm {
  email: string
  password: string
}

export default function SecretaryLogin() {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular autenticação
    setTimeout(() => {
      if (form.email && form.password) {
        // Simular dados da secretária
        const secretaryData = {
          id: "1",
          name: "Maria Silva",
          email: form.email,
          phone: "(11) 99999-9999",
          cpf: "123.456.789-00",
          employeeId: "SEC001",
          department: "Recepção",
          permissions: ["manage_appointments", "view_patients", "manage_schedule"],
        }

        localStorage.setItem("secretaryData", JSON.stringify(secretaryData))
        localStorage.setItem("userType", "secretary")

        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vinda ao sistema, " + secretaryData.name,
        })

        router.push("/secretary/pacientes") // direciona para a página
      } else {
        toast({
          title: "Erro no login",
          description: "Por favor, preencha todos os campos.",
          variant: "destructive",
        })
      }
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            <UserCheck className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">Área da Secretária</CardTitle>
            <CardDescription className="text-muted-foreground mt-2">Acesse o sistema de gerenciamento</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@clinica.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="pl-10 h-11 border-border focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="pl-10 pr-10 h-11 border-border focus:border-purple-500 focus:ring-purple-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 dark:text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <div className="relative">
            <Separator className="my-6" />
            <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-sm text-muted-foreground">
              ou
            </span>
          </div>

          <div className="text-center">
            <Link href="/" className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-500 font-medium hover:underline">
              Voltar à página inicial
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
