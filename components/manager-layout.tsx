"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Bell,
  Calendar,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";

interface ManagerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  department: string;
  permissions: object;
}

interface ManagerLayoutProps {
  children: React.ReactNode;
}

export default function ManagerLayout({ children }: ManagerLayoutProps) {
  const [managerData, setManagerData] = useState<ManagerData | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const data = localStorage.getItem("managerData");
    if (data) {
      setManagerData(JSON.parse(data));
    } else {
      router.push("/manager/login");
    }
  }, [router]);

  // 🔥 Responsividade automática da sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true); // colapsa em telas pequenas (lg breakpoint ~ 1024px)
      } else {
        setSidebarCollapsed(false); // expande em desktop
      }
    };

    handleResize(); // roda na primeira carga
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => setShowLogoutDialog(true);

  const confirmLogout = () => {
    localStorage.removeItem("managerData");
    setShowLogoutDialog(false);
    router.push("/");
  };

  const cancelLogout = () => setShowLogoutDialog(false);

  const menuItems = [
    { href: "/manager/dashboard", icon: Home, label: "Dashboard" },
    { href: "#", icon: Calendar, label: "Relatórios gerenciais" },
    { href: "#", icon: User, label: "Gestão de Usuários" },
    { href: "#", icon: User, label: "Gestão de Médicos" },
    { href: "#", icon: Calendar, label: "Configurações" },
  ];

  if (!managerData) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div
        className={`bg-card border-r border-border transition-all duration-300 fixed top-0 h-screen flex flex-col z-30
          ${sidebarCollapsed ? "w-16" : "w-64"}`}
      >
        {/* Logo + collapse button */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
              </div>
              <span className="font-semibold text-foreground">
                MidConnecta
              </span>
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

        {/* Menu Items */}
        <nav className="flex-1 p-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Perfil no rodapé */}
        <div className="border-t p-4 mt-auto">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>
                {managerData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {managerData.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {managerData.department}
                </p>
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

      {/* Conteúdo principal */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 w-full
          ${sidebarCollapsed ? "ml-16" : "ml-64"}`}
      >
        {/* Header */}
        <header className="bg-card border-b border-border px-4 md:px-6 py-4 flex items-center justify-between">
          {/* Search */}
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar paciente"
                className="pl-10 bg-background border-border"
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="flex items-center gap-4 ml-auto">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs">
                1
              </Badge>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>

      {/* Logout confirmation dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Saída</DialogTitle>
            <DialogDescription>
              Deseja realmente sair do sistema? Você precisará fazer login
              novamente para acessar sua conta.
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
  );
}