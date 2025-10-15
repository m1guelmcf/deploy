import { api } from "./api.mjs";
export const usersService = {
  create_user: (data) => api.post(`/functions/v1/create-user`),
  list_roles: () => api.get(`/rest/v1/user_roles`),
  full_data: (id) => {
    const endpoint = `/functions/v1/user-info?user_id=${id}`;
    return api.get(endpoint);
  },
  summary_data: () => api.get(`/auth/v1/user`)
}