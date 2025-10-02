import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, User, Shield, Stethoscope, Receipt, IdCard  } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Central de Operações <br>
          </br>
          MidConnecta

          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Gerencie suas consultas médicas de forma simples e eficiente
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
            <CardHeader className="text-center flex-shrink-0">
              <User className="w-12 h-12 text-black-600 mx-auto mb-4" />
              <CardTitle>Área do Paciente</CardTitle>
              <CardDescription>Tenha o controle total da sua saúde: agende, consulte o histórico e informações pessoais</CardDescription>
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
              <CardDescription>Otimize o fluxo de trabalho e mantenha a agenda sempre organizada</CardDescription>
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
              <CardDescription>Visualize sua agenda, laudos de pacientes e histórico para um diagnóstico preciso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow flex flex-col">
              <div className="space-y-3 flex-grow">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Gerenciar agenda</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>Ver pacientes e laudos</span>
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

          <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
            <CardHeader className="text-center flex-shrink-0">
              <IdCard  className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Área do Gestor</CardTitle>
              <CardDescription>Configure o sistema, gerencie usuários e contre a operação da clínica</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow flex flex-col">
              <div className="space-y-3 flex-grow">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Relatórios gerenciais</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>Configurações do sistema</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Gestão de usuários</span>
                </div>
              </div>
              <Link href="#" className="block mt-auto">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Entrar como Gestor</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
            <CardHeader className="text-center flex-shrink-0">
              <Receipt className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Área de Finanças</CardTitle>
              <CardDescription>Controle o faturamento, pagamentos e a saúde financeira da clínica</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow flex flex-col">
              <div className="space-y-3 flex-grow">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Relatórios financeiros</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>Faturamento</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Controle de pagamentos</span>
                </div>
              </div>
              <Link href="#" className="block mt-auto">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">Entrar como Financeiro</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}