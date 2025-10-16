// app/manager/usuario/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import ManagerLayout from "@/components/manager-layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Eye, Filter, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api, login } from "services/api.mjs";
import { usersService } from "services/usersApi.mjs";

interface FlatUser {
  id: string;
  user_id: string;
  full_name?: string;
  email: string;
  phone?: string | null;
  role: string;
}

interface UserInfoResponse {
  user: any;
  profile: any;
  roles: string[];
  permissions: Record<string, boolean>;
}

export default function UsersPage() {
  const [users, setUsers] = useState<FlatUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<UserInfoResponse | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1) pega roles
      const rolesData: any[] = await usersService.list_roles();
      // Garante que rolesData é array
      const rolesArray = Array.isArray(rolesData) ? rolesData : [];

      // 2) pega todos os profiles de uma vez (para evitar muitos requests)
      const profilesData: any[] = await api.get(`/rest/v1/profiles?select=id,full_name,email,phone`);
      const profilesById = new Map<string, any>();
      if (Array.isArray(profilesData)) {
        for (const p of profilesData) {
          if (p?.id) profilesById.set(p.id, p);
        }
      }

      // 3) mapear roles -> flat users, usando ID específico de cada item
      const mapped: FlatUser[] = rolesArray.map((roleItem) => {
        const uid = roleItem.user_id;
        const profile = profilesById.get(uid);
        return {
          id: uid,
          user_id: uid,
          full_name: profile?.full_name ?? "—",
          email: profile?.email ?? "—",
          phone: profile?.phone ?? "—",
          role: roleItem.role ?? "—",
        };
      });

      setUsers(mapped);
      console.log("[fetchUsers] mapped count:", mapped.length);
    } catch (err: any) {
      console.error("Erro ao buscar usuários:", err);
      setError("Não foi possível carregar os usuários. Veja console.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        await login(); // garante token
      } catch (e) {
        console.warn("login falhou no init:", e);
      }
      await fetchUsers();
    };
    init();
  }, [fetchUsers]);

  const openDetailsDialog = async (flatUser: FlatUser) => {
    setDetailsDialogOpen(true);
    setUserDetails(null);

    try {
      console.log("[openDetailsDialog] user_id:", flatUser.user_id);
      const data = await usersService.full_data(flatUser.user_id);
      console.log("[openDetailsDialog] full_data returned:", data);
      setUserDetails(data);
    } catch (err: any) {
      console.error("Erro ao carregar detalhes:", err);
      // fallback com dados já conhecidos
      setUserDetails({
        user: { id: flatUser.user_id, email: flatUser.email },
        profile: { full_name: flatUser.full_name, phone: flatUser.phone },
        roles: [flatUser.role],
        permissions: {},
      });
    }
  };

  const filteredUsers =
    selectedRole && selectedRole !== "all" ? users.filter((u) => u.role === selectedRole) : users;

  return (
    <ManagerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
            <p className="text-sm text-gray-500">Gerencie usuários.</p>
          </div>
          <Link href="/manager/usuario/novo">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" /> Novo Usuário
            </Button>
          </Link>
        </div>

        <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-200">
          <Filter className="w-5 h-5 text-gray-400" />
          <Select onValueChange={setSelectedRole} value={selectedRole}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por papel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="gestor">Gestor</SelectItem>
              <SelectItem value="medico">Médico</SelectItem>
              <SelectItem value="secretaria">Secretária</SelectItem>
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
              Nenhum usuário encontrado.
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cargo</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-500">{u.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{u.full_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{u.phone}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 capitalize">{u.role}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="outline" size="icon" onClick={() => openDetailsDialog(u)} title="Visualizar">
                          <Eye className="h-4 w-4" />
                        </Button>
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
              <AlertDialogTitle className="text-2xl">{userDetails?.profile?.full_name || "Detalhes do Usuário"}</AlertDialogTitle>
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
                    <div><strong>Nome completo:</strong> {userDetails.profile.full_name}</div>
                    <div><strong>Telefone:</strong> {userDetails.profile.phone}</div>
                    <div><strong>Roles:</strong> {userDetails.roles?.join(", ")}</div>
                    <div>
                      <strong>Permissões:</strong>
                      <ul className="list-disc list-inside">
                        {Object.entries(userDetails.permissions || {}).map(([k,v]) => <li key={k}>{k}: {v ? "Sim" : "Não"}</li>)}
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
