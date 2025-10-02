"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Bell, Calendar, Clock, User, LogOut, Menu, X, Home, FileText, ChevronLeft, ChevronRight } from "lucide-react";

interface DoctorData {
    id: string;
    name: string;
    email: string;
    phone: string;
    cpf: string;
    crm: string;
    specialty: string;
    department: string;
    permissions: object;
}

interface PatientLayoutProps {
    children: React.ReactNode;
}

export default function DoctorLayout({ children }: PatientLayoutProps) {
    const [doctorData, setDoctorData] = useState<DoctorData | null>(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Novo estado para menu mobile
    const [windowWidth, setWindowWidth] = useState(0);
    const isMobile = windowWidth < 1024; // breakpoint lg
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const data = localStorage.getItem("doctorData");
        if (data) {
            setDoctorData(JSON.parse(data));
        } else {
            router.push("/doctor/login");
        }
    }, [router]);

    useEffect(() => {
  const handleResize = () => setWindowWidth(window.innerWidth);
  handleResize(); // inicializa com a largura atual
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

useEffect(() => {
  if (isMobile) {
    setSidebarCollapsed(true);
  } else {
    setSidebarCollapsed(false);
  }
}, [isMobile]);

    const handleLogout = () => {
        setShowLogoutDialog(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem("doctorData");
        setShowLogoutDialog(false);
        router.push("/");
    };

    const cancelLogout = () => {
        setShowLogoutDialog(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const menuItems = [
        {
            href: "#",
            icon: Home,
            label: "Dashboard",
            // Botão para o dashboard do médico
        },
        {
            href: "#",
            icon: Calendar,
            label: "Consultas",
            // Botão para página de consultas marcadas do médico atual
        },
        {
            href: "#",
            icon: Clock,
            label: "Editor de Laudo",
            // Botão para página do editor de laudo
        },
        {
            href: "/doctor/medicos",
            icon: User,
            label: "Pacientes",
            // Botão para a página de visualização de todos os pacientes
        },
    ];

    if (!doctorData) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar para desktop */}
            <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-64"} fixed left-0 top-0 h-screen flex flex-col z-50`}>
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        {!sidebarCollapsed && (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                                </div>
                                <span className="font-semibold text-gray-900">MidConnecta</span>
                            </div>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-1">
                            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>

                <nav className="flex-1 p-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                        return (
                            <Link key={item.href} href={item.href}>
                                <div className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${isActive ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" : "text-gray-600 hover:bg-gray-50"}`}>
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                // ... (seu código anterior)

            {/* Sidebar para desktop */}
            <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-64"} fixed left-0 top-0 h-screen flex flex-col z-50`}>
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        {!sidebarCollapsed && (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                                </div>
                                <span className="font-semibold text-gray-900">Hospital System</span>
                            </div>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-1">
                            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>

                <nav className="flex-1 p-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                        return (
                            <Link key={item.href} href={item.href}>
                                <div className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${isActive ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" : "text-gray-600 hover:bg-gray-50"}`}>
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t p-4 mt-auto">
                    <div className="flex items-center space-x-3 mb-4">
                        {/* Se a sidebar estiver recolhida, o avatar e o texto do usuário também devem ser condensados ou ocultados */}
                        {!sidebarCollapsed && (
                            <>
                                <Avatar>
                                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                                    <AvatarFallback>
                                        {doctorData.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{doctorData.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{doctorData.specialty}</p>
                                </div>
                            </>
                        )}
                        {sidebarCollapsed && (
                            <Avatar className="mx-auto"> {/* Centraliza o avatar quando recolhido */}
                                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                                <AvatarFallback>
                                    {doctorData.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                        )}
                    </div>

                    {/* Novo botão de sair, usando a mesma estrutura dos itens de menu */}
                    <div
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors text-gray-600 hover:bg-gray-50 cursor-pointer ${sidebarCollapsed ? "justify-center" : ""}`}
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {!sidebarCollapsed && <span className="font-medium">Sair</span>}
                    </div>
                </div>
            </div>
        
            </div>

            {/* Sidebar para mobile (apresentado como um menu overlay) */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleMobileMenu}></div>
            )}
            <div className={`bg-white border-r border-gray-200 fixed left-0 top-0 h-screen flex flex-col z-50 transition-transform duration-300 md:hidden ${isMobileMenuOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}`}>
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded-sm"></div>
                        </div>
                        <span className="font-semibold text-gray-900">Hospital System</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={toggleMobileMenu} className="p-1">
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <nav className="flex-1 p-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                        return (
                            <Link key={item.href} href={item.href} onClick={toggleMobileMenu}> {/* Fechar menu ao clicar */}
                                <div className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${isActive ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600" : "text-gray-600 hover:bg-gray-50"}`}>
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t p-4 mt-auto">
                    <div className="flex items-center space-x-3 mb-4">
                        <Avatar>
                            <AvatarImage src="/placeholder.svg?height=40&width=40" />
                            <AvatarFallback>
                                {doctorData.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{doctorData.name}</p>
                            <p className="text-xs text-gray-500 truncate">{doctorData.specialty}</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={() => { handleLogout(); toggleMobileMenu(); }}> {/* Fechar menu ao deslogar */}
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                    </Button>
                </div>
            </div>


            {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input placeholder="Buscar paciente" className="pl-10 bg-gray-50 border-gray-200" />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="relative">
                                <Bell className="w-5 h-5" />
                                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">1</Badge>
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
                        <DialogDescription>Deseja realmente sair do sistema? Você precisará fazer login novamente para acessar sua conta.</DialogDescription>
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