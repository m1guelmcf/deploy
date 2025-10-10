"use client";

import React, { useEffect, useState, useCallback } from "react"
import ManagerLayout from "@/components/manager-layout";
import Link from "next/link"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Eye, Filter, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Mock user service for demonstration. Replace with your actual API service.
const usersService = {
  list: async (): Promise<User[]> => {
    console.log("API Call: Fetching users...");
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return [
      { id: 1, full_name: 'Alice Admin', email: 'alice.admin@example.com', phone: '(11) 98765-4321', role: 'user' },

    ];
  },
  delete: async (id: number): Promise<void> => {
    console.log(`API Call: Deleting user with ID ${id}`);
    await new Promise(resolve => setTimeout(resolve, 700));
    // In a real app, you'd handle potential errors here
  }
};

// Interface for a User object
interface User {
    id: number;
    full_name: string;
    email: string;
    phone: string | null;
    role: 'admin' | 'gestor' | 'medico' | 'secretaria' | 'user';
}

// Interface for User Details (can be the same as User for this case)
interface UserDetails extends User {}

export default function UsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState<number | null>(null);
  
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data: User[] = await usersService.list();
      setUsers(data || []); 
    } catch (e: any) {
      console.error("Erro ao carregar lista de usuários:", e);
      setError("Não foi possível carregar a lista de usuários. Tente novamente.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openDetailsDialog = (user: User) => {
    setUserDetails(user);
    setDetailsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (userToDeleteId === null) return;

    setLoading(true);
    try {
      await usersService.delete(userToDeleteId);
      console.log(`Usuário com ID ${userToDeleteId} excluído com sucesso!`);
      setDeleteDialogOpen(false);
      setUserToDeleteId(null);
      await fetchUsers(); // Refresh the list after deletion
    } catch (e) {
      console.error("Erro ao excluir:", e);
      alert("Erro ao excluir usuário.");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (userId: number) => {
    setUserToDeleteId(userId);
    setDeleteDialogOpen(true);
  };
  
  const handleEdit = (userId: number) => {
    // Assuming the edit page is at a similar path
    router.push(`/manager/usuario/${userId}/editar`);
  };

  return (
    <ManagerLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários Cadastrados</h1>
          <p className="text-sm text-gray-500">Gerencie todos os usuários do sistema.</p>
        </div>
        <Link href="/manager/usuario/novo">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Novo
          </Button>
        </Link>
      </div>

      {/* Filters Section */}
      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-200">
        <Filter className="w-5 h-5 text-gray-400" />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por Papel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="gestor">Gestor</SelectItem>
            <SelectItem value="medico">Médico</SelectItem>
            <SelectItem value="secretaria">Secretaria</SelectItem>
            <SelectItem value="user">Usuário</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
        {loading ? (
            <div className="p-8 text-center text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-green-600" />
                Carregando usuários...
            </div>
        ) : error ? (
            <div className="p-8 text-center text-red-600">
                {error}
            </div>
        ) : users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
                Nenhum usuário cadastrado. <Link href="/manager/usuario/novo" className="text-green-600 hover:underline">Adicione um novo</Link>.
            </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome Completo</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Papel</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.full_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phone || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-1">
                          <Button variant="outline" size="icon" onClick={() => openDetailsDialog(user)} title="Visualizar Detalhes">
                              <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleEdit(user.id)} title="Editar">
                              <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => openDeleteDialog(user.id)} title="Excluir">
                              <Trash2 className="h-4 w-4 text-red-600" />
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
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirma a exclusão?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação é irreversível e excluirá permanentemente o registro deste usuário.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* User Details Dialog */}
      <AlertDialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">{userDetails?.full_name}</AlertDialogTitle>
            <AlertDialogDescription>
              {userDetails && (
                <div className="space-y-3 pt-2 text-left text-gray-700">
                  <div className="grid grid-cols-1 gap-y-2 text-sm">
                      <div><strong>E-mail:</strong> {userDetails.email}</div>
                      <div><strong>Telefone:</strong> {userDetails.phone || 'Não informado'}</div>
                      <div className="capitalize"><strong>Papel:</strong> {userDetails.role}</div>
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