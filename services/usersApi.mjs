// services/usersApi.mjs (Versão Corrigida)

import { api } from "./api.mjs";

export const usersService = {
  create_user: (data) => api.post(`/functions/v1/create-user`),
  
  // CORREÇÃO: Voltamos a pedir apenas os campos que sabemos que a view 'user_roles' tem 
  // (id ou user_id, e role), e usamos o endpoint 'full_data' para obter os detalhes de nome/telefone.
  // SE a sua view 'user_roles' contiver uma coluna chamada 'user_id', tente a próxima linha:
  // list_roles: () => api.get(`/rest/v1/user_roles?select=user_id,role,profiles(full_name,phone)`),
  //
  // PORÉM, VAMOS ASSUMIR QUE A RELAÇÃO ESTÁ REALMENTE QUEBRADA E SIMPLIFICAR A CHAMADA INICIAL:
  list_roles: () => api.get(`/rest/v1/user_roles?select=id,user_id,email,role`),
  // Se o email também não estiver em 'user_roles', apenas use 'id,user_id,role'.
  // O importante é que esta chamada de API NÃO DÊ ERRO 400.
  
  full_data: (id) => {
    const endpoint = `/functions/v1/user-info?user_id=${id}`;
    return api.get(endpoint);
  },
  summary_data: () => api.get(`/auth/v1/user`)
}