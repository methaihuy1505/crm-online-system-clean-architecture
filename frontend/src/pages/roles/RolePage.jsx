import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

import RoleHeader from "./components/RoleHeader";
import RolePermissionsTable from "./components/RolePermissionsTable";
import RoleSidebar from "./components/RoleSidebar";
import RoleFormModal from "./components/RoleFormModal"; // IMPORT MODAL MỚI
import { roleService, moduleService } from "./roleService";

const RolePage = () => {
  const [query, setQuery] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [modules, setModules] = useState([]);
  const [checkedIds, setCheckedIds] = useState(new Set());
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // States cho Modal Thêm/Sửa Role
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const fetchRolesAndModules = async (forceSelectRoleId = null) => {
    try {
      const [rolesData, modulesData] = await Promise.all([
        roleService.getAll(),
        moduleService.getAll(),
      ]);
      setRoles(rolesData);
      setModules(modulesData);

      if (rolesData.length > 0) {
        let roleToSelect = rolesData[0];
        if (forceSelectRoleId) {
          const found = rolesData.find((r) => r.id === forceSelectRoleId);
          if (found) roleToSelect = found;
        } else if (selectedRole) {
          const found = rolesData.find((r) => r.id === selectedRole.id);
          if (found) roleToSelect = found;
        }
        await loadRolePermissions(roleToSelect, modulesData);
      } else {
        setSelectedRole(null);
        setCheckedIds(new Set());
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Không thể tải dữ liệu hệ thống!";
      console.error(err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRolesAndModules();
  }, []);

  const loadRolePermissions = async (role, modulesSnapshot) => {
    try {
      const detail = await roleService.getById(role.id);
      setSelectedRole(role);
      setCheckedIds(new Set(detail.permissionIds ?? []));
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Không thể tải quyền của vai trò!";
      console.error(err);
      toast.error(errorMessage);
    }
  };

  const handleSelectRole = (role) => {
    loadRolePermissions(role, modules);
  };

  const togglePermission = (permissionId) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      next.has(permissionId)
        ? next.delete(permissionId)
        : next.add(permissionId);
      return next;
    });
  };

  const toggleModule = (modulePermissions, nextValue) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      modulePermissions.forEach((p) => {
        nextValue ? next.add(p.id) : next.delete(p.id);
      });
      return next;
    });
  };

  // --- LƯU PHÂN QUYỀN VÀO ROLE ĐANG CHỌN (TỪ BẢNG CHECKBOX) ---
  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    setSaving(true);
    try {
      await roleService.update(selectedRole.id, {
        roleName: selectedRole.roleName,
        code: selectedRole.code,
        description: selectedRole.description,
        permissionIds: Array.from(checkedIds),
      });
      toast.success("Lưu phân quyền thành công!");
      await fetchRolesAndModules(selectedRole.id); // Load lại để đồng bộ
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Lưu phân quyền thất bại!";
      console.error(err);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // --- MỞ MODAL TẠO MỚI/SỬA ---
  const handleOpenCreateModal = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  // --- XỬ LÝ LƯU THÔNG TIN CƠ BẢN TỪ MODAL ---
  const handleSaveRoleMetadata = async (formData) => {
    try {
      if (editingRole) {
        // [CỰC KỲ QUAN TRỌNG] Phải getById lấy permissionIds cũ ra để update không bị mất
        const detail = await roleService.getById(editingRole.id);
        await roleService.update(editingRole.id, {
          ...formData,
          permissionIds: detail.permissionIds || [],
        });
        toast.success("Cập nhật thông tin vai trò thành công!");
      } else {
        // Tạo mới hoàn toàn
        await roleService.create({
          ...formData,
          permissionIds: [], // Vai trò mới chưa có quyền gì
        });
        toast.success("Đã tạo vai trò mới!");
      }
      setIsModalOpen(false);
      await fetchRolesAndModules(editingRole ? editingRole.id : null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Đã xảy ra lỗi khi lưu vai trò!";
      toast.error(errorMessage);
      console.error(err);
    }
  };

  // --- XÓA ROLE ---
  const handleDeleteRole = async (role) => {
    if (
      window.confirm(
        `Xóa vai trò "${role.roleName}" có thể ảnh hưởng tới các user đang được gán. Bạn có chắc chắn?`,
      )
    ) {
      try {
        await roleService.remove(role.id);
        toast.success(`Đã xóa vai trò ${role.roleName}!`);
        await fetchRolesAndModules(); // Reset list
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Lỗi: Không thể xóa vai trò này!";
        toast.error(errorMessage);
      }
    }
  };

  const filteredRoles = roles.filter((role) => {
    const haystack =
      `${role.roleName} ${role.code} ${role.description ?? ""}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center text-slate-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col gap-6 rounded-[28px] bg-[#f8f9fa] text-slate-900">
      <RoleHeader
        query={query}
        onQueryChange={setQuery}
        onCreateRole={handleOpenCreateModal} // Gọi hàm mở modal
      />

      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        {/* Truyền thêm onEdit và onDelete */}
        <RoleSidebar
          roles={filteredRoles}
          selectedRoleId={selectedRole?.id}
          onSelectRole={handleSelectRole}
          onEditRole={handleOpenEditModal}
          onDeleteRole={handleDeleteRole}
        />

        <RolePermissionsTable
          modules={modules}
          checkedIds={checkedIds}
          onTogglePermission={togglePermission}
          onToggleModule={toggleModule}
          onSave={handleSavePermissions}
          saving={saving}
        />
      </div>

      {/* Render Modal */}
      <RoleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingRole}
        onSave={handleSaveRoleMetadata}
      />
    </div>
  );
};

export default RolePage;
