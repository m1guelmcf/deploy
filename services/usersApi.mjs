import { api } from "./api.mjs";

export const usersService = {
  create_user: (data) => api.post('/functions/v1/create-user'),
  list_roles: () => api.get("/rest/v1/user_roles"),
  full_data: () => api.get(`/functions/v1/user-info`),
  summary_data: () => api.get('/auth/v1/user')
}