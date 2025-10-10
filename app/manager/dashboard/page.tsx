import ManagerLayout from "@/components/manager-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Plus } from "lucide-react"
import Link from "next/link"

export default function ManagerDashboard() {
    return (
        <ManagerLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Bem-vindo ao seu portal de consultas médicas</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Relatórios gerenciais</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3</div>
                            <p className="text-xs text-muted-foreground">2 não lidos, 1 lido</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Gestão de usuários</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">João Marques</div>
                            <p className="text-xs text-muted-foreground">fez login a 13min</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Perfil</CardTitle>
                            <User className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">100%</div>
                            <p className="text-xs text-muted-foreground">Dados completos</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ações Rápidas</CardTitle>
                            <CardDescription>Acesse rapidamente as principais funcionalidades</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Link href="##">
                                <Button className="w-full justify-start">
                                    <Plus className="mr-2 h-4 w-4" />
                                    #
                                </Button>
                            </Link>
                            <Link href="##">
                                <Button variant="outline" className="w-full justify-start bg-transparent">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    #
                                </Button>
                            </Link>
                            <Link href="##">
                                <Button variant="outline" className="w-full justify-start bg-transparent">
                                    <User className="mr-2 h-4 w-4" />
                                    #
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Gestão de Médicos</CardTitle>
                            <CardDescription>Médicos online</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">Dr. Silva</p>
                                        <p className="text-sm text-gray-600">Cardiologia</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">On-line</p>
                                        <p className="text-sm text-gray-600"></p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">Dra. Santos</p>
                                        <p className="text-sm text-gray-600">Dermatologia</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">Off-line</p>
                                        <p className="text-sm text-gray-600">Visto as 8:33</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ManagerLayout>
    )
}
