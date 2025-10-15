"use client";

import React, { useEffect, useState, useCallback } from "react";
import ManagerLayout from "@/components/manager-layout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, Filter, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { usersService } from "services/usersApi.mjs";

interface User {
  user: {
    id: string;
    email: string;
    email_confirmed_at?: string;
    created_at?: string;
    last_sign_in_at?: string;
  };
  profile: {
    id?: string;
    full_name?: string;
    email?: string;
    phone?: string | null;
    avatar_url?: string;
    disabled?: boolean;
    created_at?: string;
    updated_at?: string;
  };
  roles: string[];
  permissions: {
    isAdmin?: boolean;
    isManager?: boolean;
    isDoctor?: boolean;
    isSecretary?: boolean;
    isAdminOrManager?: boolean;
    [key: string]: boolean | undefined;
  };
}


interface FlatUser {
  id: string;       
  user_id: string;      
  full_name?: string;
  email: string;
  phone?: string | null;
  role: string;
}



export default function UsersPage() {
  const router = useRouter();

  
  const [users, setUsers] = useState<FlatUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<User | null>(null); 
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const fetchUsers = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const data = await usersService.list_roles(); // já retorna o JSON diretamente
    console.log("Resposta da API list_roles:", data);

    if (Array.isArray(data)) {
      const mappedUsers: FlatUser[] = data.map((item: any) => ({
        id: item.id || (item.user_id ?? ""),           // id da linha ou fallback
        user_id: item.user_id || item.id || "",        // garante que user_id exista
        full_name: item.full_name || "—",
        email: item.email || "—",
        phone: item.phone ?? "—",
        role: item.role || "—",
      }));

      setUsers(mappedUsers);
    } else {
      console.warn("Formato inesperado recebido em list_roles:", data);
      setUsers([]);
    }
  } catch (err: any) {
    console.error("Erro ao buscar usuários:", err);
    setError("Não foi possível carregar os usuários. Tente novamente.");
    setUsers([]);
  } finally {
    setLoading(false);
  }
}, []);

  
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  
  

  
  const openDetailsDialog = async (flatUser: FlatUser) => {
  setDetailsDialogOpen(true);
  setUserDetails(null);

  try {
    console.log("Buscando detalhes do user_id:", flatUser.user_id);
    const fullUserData: User = await usersService.full_data(flatUser.user_id);
    setUserDetails(fullUserData);
  } catch (err: any) {
    console.error("Erro ao buscar detalhes do usuário:", err);
    setUserDetails({
      user: {
        id: flatUser.user_id,
        email: flatUser.email || "",
        created_at: "Erro ao Carregar",
        last_sign_in_at: "Erro ao Carregar",
      },
      profile: {
        full_name: flatUser.full_name || "Erro ao Carregar Detalhes",
        phone: flatUser.phone || "—",
      },
      roles: [],
      permissions: {},
    } as any);
  }
};



  const filteredUsers = selectedRole && selectedRole !== "all"
  ? users.filter((u) => u.role === selectedRole)
  : users;



  return (
    <ManagerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Usuários Cadastrados</h1>
            <p className="text-sm text-gray-500">Gerencie todos os usuários e seus papéis no sistema.</p>
          </div>
          <Link href="/manager/usuario/novo">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" /> Adicionar Novo
            </Button>
          </Link>
        </div>

        
        <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-200">
          <Filter className="w-5 h-5 text-gray-400" />
          <Select onValueChange={setSelectedRole} value={selectedRole}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Filtrar por Papel" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">Todos</SelectItem>
    <SelectItem value="admin">Admin</SelectItem>
    <SelectItem value="gestor">Gestor</SelectItem>
    <SelectItem value="medico">Médico</SelectItem>
    <SelectItem value="secretaria">Secretaria</SelectItem>
    <SelectItem value="user">Usuário</SelectItem>
  </SelectContent>
</Select>

        </div>

        
        <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-green-600" />
              Carregando usuários...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhum usuário encontrado.{" "}
              <Link href="/manager/usuario/novo" className="text-green-600 hover:underline">
                Adicione um novo
              </Link>
              .
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">E-mail</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Papel</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                
                    <tr key={user.id} className="hover:bg-gray-50"> 
                      <td className="px-6 py-4 text-sm text-gray-700">{user.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{user.full_name || "—"}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.email || "—"}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.phone || "—"}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 capitalize">{user.role || "—"}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-1">
                         <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openDetailsDialog(user)} 
                            title="Visualizar"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

   
        <AlertDialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl">
                {userDetails?.profile?.full_name || userDetails?.user?.email || "Detalhes do Usuário"}
              </AlertDialogTitle>
              <AlertDialogDescription>
      
              {!userDetails ? (
                <div className="p-4 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3 text-green-600" />
                    Buscando dados completos...
                </div>
              ) : (
                <div className="space-y-3 pt-2 text-left text-gray-700">
                
                 <div><strong>ID:</strong> {userDetails.user.id}</div>
                  <div><strong>E-mail:</strong> {userDetails.user.email}</div>
                  <div><strong>Email confirmado em:</strong> {userDetails.user.email_confirmed_at || "—"}</div>
                  <div><strong>Último login:</strong> {userDetails.user.last_sign_in_at || "—"}</div>
                  <div><strong>Criado em:</strong> {userDetails.user.created_at || "—"}</div>

                 
                  <div><strong>Nome completo:</strong> {userDetails.profile.full_name || "—"}</div>
                  <div><strong>Telefone:</strong> {userDetails.profile.phone || "—"}</div>
                  {userDetails.profile.avatar_url && (
                    <div><strong>Avatar:</strong> <img src={userDetails.profile.avatar_url} className="w-16 h-16 rounded-full mt-1" /></div>
                  )}
                  <div><strong>Conta desativada:</strong> {userDetails.profile.disabled ? "Sim" : "Não"}</div>
                  <div><strong>Profile criado em:</strong> {userDetails.profile.created_at || "—"}</div>
                  <div><strong>Profile atualizado em:</strong> {userDetails.profile.updated_at || "—"}</div>

               
                  <div>
                    <strong>Roles:</strong>
                    <ul className="list-disc list-inside">
                      {userDetails.roles.map((role, idx) => <li key={idx}>{role}</li>)}
                    </ul>
                  </div>

                  <div>
                    <strong>Permissões:</strong>
                    <ul className="list-disc list-inside">
                      {Object.entries(userDetails.permissions).map(([key, value]) => (
                        <li key={key}>{key}: {value ? "Sim" : "Não"}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}


              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Fechar</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ManagerLayout>
  );
}