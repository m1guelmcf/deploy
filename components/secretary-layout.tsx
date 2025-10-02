"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  Search,
  Bell,
  Calendar,
  Clock,
  User,
  LogOut,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface SecretaryData {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  employeeId: string
  department: string
  permissions: object
}

interface PatientLayoutProps {
  children: React.ReactNode
}

export default function SecretaryLayout({ children }: PatientLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // 🔹 Colapsar no mobile e expandir no desktop automaticamente
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true)
      } else {
        setSidebarCollapsed(false)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleLogout = () => setShowLogoutDialog(true)
  const confirmLogout = () => {
    setShowLogoutDialog(false)
    router.push("/")
  }
  const cancelLogout = () => setShowLogoutDialog(false)

  const menuItems = [
    { href: "##", icon: Home, label: "Dashboard" },
    { href: "###", icon: Calendar, label: "Consultas" },
    { href: "#", icon: Clock, label: "Agendar Consulta" },
    { href: "/secretary/pacientes", icon: User, label: "Pacientes" },
  ]

  const secretaryData: SecretaryData = {
    id: "1",
    name: "Secretária Exemplo",
    email: "secretaria@hospital.com",
    phone: "999999999",
    cpf: "000.000.000-00",
    employeeId: "12345",
    department: "Atendimento",
    permissions: {},
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 transition-all duration-300 
          ${sidebarCollapsed ? "w-16" : "w-64"} 
          fixed left-0 top-0 h-screen flex flex-col z-10`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <span className="font-semibold text-gray-900">MedConnect</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <nav className="flex-1 p-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="border-t p-4 mt-auto">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>
                {secretaryData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {secretaryData.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{secretaryData.email}</p>
              </div>
            )}
          </div>
          {/* Botão Sair - ajustado para responsividade */}
          <Button
            variant="outline"
            size="sm"
            className={
              sidebarCollapsed
                ? "w-full bg-transparent flex justify-center items-center p-2" // Centraliza o ícone quando colapsado
                : "w-full bg-transparent"
            }
            onClick={handleLogout}
          >
            <LogOut
              className={sidebarCollapsed ? "h-5 w-5" : "mr-2 h-4 w-4"}
            />{" "}
            {/* Remove margem quando colapsado */}
            {!sidebarCollapsed && "Sair"}{" "}
            {/* Mostra o texto apenas quando não está colapsado */}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar paciente"
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Este botão no header parece ter sido uma cópia do botão "Sair" da sidebar.
                  Removi a lógica de sidebarCollapsed aqui, pois o header é independente.
                  Se a intenção era ter um botão de logout no header, ele não deve ser afetado pela sidebar.
                  Ajustei para ser um botão de sino de notificação, como nos exemplos anteriores,
                  já que você tem o ícone Bell importado e uma badge para notificação.
                  Se você quer um botão de LogOut aqui, por favor, me avise!
              */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                  1
                </Badge>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>

      {/* Logout confirmation dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Saída</DialogTitle>
            <DialogDescription>
              Deseja realmente sair do sistema? Você precisará fazer login novamente para acessar sua conta.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={cancelLogout}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}