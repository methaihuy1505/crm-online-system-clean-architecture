import api from "../../lib/api";
// adjust path to your axios instance

// ─── Roles ────────────────────────────────────────────────────────────────────

export const roleService = {
  /** GET /roles → [{ id, roleName, code, description, isActive }] */
  getAll: () => api.get("/roles").then((r) => r.data),

  /** GET /roles/:id → { id, roleName, code, description, permissionIds: number[] } */
  getById: (id) => api.get(`/roles/${id}`).then((r) => r.data),

  /** POST /roles */
  create: (payload) => api.post("/roles", payload).then((r) => r.data),

  /**
   * PUT /roles/:id
   * payload: { roleName, code, description, permissionIds: number[] }
   */
  update: (id, payload) => api.put(`/roles/${id}`, payload).then((r) => r.data),

  /** DELETE /roles/:id */
  remove: (id) => api.delete(`/roles/${id}`),
};

// ─── Modules + Permissions (static catalogue) ─────────────────────────────────

export const moduleService = {
  /** GET /modules → [{ id, code, name, sortOrder, permissions: [{ id, action, code, name }] }] */
  getAll: () => api.get("/modules").then((r) => r.data),
};