import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, User, Shield, Stethoscope } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sistema de Consultas Médicas</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gerencie suas consultas médicas de forma simples e eficiente
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
            <CardHeader className="text-center flex-shrink-0">
              <User className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Área do Paciente</CardTitle>
              <CardDescription>Acesse sua área pessoal para agendar consultas e gerenciar seus dados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow flex flex-col">
              <div className="space-y-3 flex-grow">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Agendar consultas</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Ver histórico de consultas</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>Gerenciar dados pessoais</span>
                </div>
              </div>
              <Link href="/patient/login" className="block mt-auto">
                <Button className="w-full">Entrar como Paciente</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
            <CardHeader className="text-center flex-shrink-0">
              <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Área da Secretária</CardTitle>
              <CardDescription>Gerencie consultas, pacientes e agenda médica</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow flex flex-col">
              <div className="space-y-3 flex-grow">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Gerenciar consultas</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>Cadastrar pacientes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Controlar agenda</span>
                </div>
              </div>
              <Link href="/secretary/login" className="block mt-auto">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Entrar como Secretária</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
            <CardHeader className="text-center flex-shrink-0">
              <Stethoscope className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Área Médica</CardTitle>
              <CardDescription>Acesso restrito para profissionais de saúde</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow flex flex-col">
              <div className="space-y-3 flex-grow">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Gerenciar agenda</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>Ver pacientes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Histórico de atendimentos</span>
                </div>
              </div>
              <Link href="/doctor/login" className="block mt-auto">
                <Button className="w-full bg-green-600 hover:bg-green-700">Entrar como Médico</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
