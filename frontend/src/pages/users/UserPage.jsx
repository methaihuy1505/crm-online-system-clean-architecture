import React, { useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import toast from "react-hot-toast";

import UserHeader from "./components/UserHeader";
import UserFilter from "./components/UserFilter";
import UserTable from "./components/UserTable";
import UserFormModal from "./components/UserFormModal";

// IMPORT HOOK PHÂN QUYỀN
import { usePermission } from "../../hooks/usePermission";

export default function UserPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // --- LẤY QUYỀN TỪ HOOK VÀ CURRENT USER ID ---
  const currentUserId = Number(localStorage.getItem("user_id")) || null;
  const { hasPermission } = usePermission();
  const canView = hasPermission("users.view");
  const canCreate = hasPermission("users.create");
  const canUpdate = hasPermission("users.update");
  const canDelete = hasPermission("users.delete");

  // Dữ liệu chính
  const [users, setUsers] = useState([]);
  
  // Dữ liệu danh mục
  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [teams, setTeams] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const [filters, setFilters] = useState({
    keyword: "", role: "ALL", status: "ALL", branchIds: [], teamIds: [],
  });
  
  const [form, setForm] = useState({
    username: "", password: "", full_name: "", email: "", phone: "",
    roleId: "", branchId: "", teamId: "", status: "ACTIVE",
  });

  const [selectedUserForRow, setSelectedUserForRow] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const tableContainerRef = useRef(null);

  const toOptionalNumber = (value) => (value === "" || value === null || value === undefined) ? null : Number(value);
  const normalizeCollection = (data) => Array.isArray(data?.result ?? data?.content ?? data ?? []) ? (data?.result ?? data?.content ?? data ?? []) : [];

  const resetFormForShortcut = () => {
    setForm({ username: "", password: "", full_name: "", email: "", phone: "", roleId: "", branchId: "", teamId: "", status: "ACTIVE" });
  };

  const displayRoleLabel = (user) => {
    const id = user?.roleId ?? user?.role?.id;
    const found = roles.find((r) => String(r.id) === String(id));
    return found?.name || found?.roleName || user?.roleName || (id ? `Vai trò #${id}` : "N/A");
  };

  const displayBranchLabel = (user) => {
    const id = user?.branchId ?? user?.branch?.id;
    const found = branches.find((b) => String(b.id) === String(id));
    return found?.name || found?.branchName || user?.branchName || (id ? `Chi nhánh #${id}` : "---");
  };

  const displayTeamLabel = (user) => {
    const id = user?.teamId ?? user?.team?.id;
    const found = teams.find((t) => String(t.id) === String(id));
    return found?.name || found?.teamName || user?.teamName || (id ? `Nhóm #${id}` : "---");
  };

  const roleOptions = useMemo(() => roles.map(r => ({ id: String(r.id), label: r.name || r.roleName, raw: r })), [roles]);
  const branchOptions = useMemo(() => branches.map(b => ({ id: String(b.id), label: b.name || b.branchName, raw: b })), [branches]);
  const teamOptions = useMemo(() => teams.map(t => ({ id: String(t.id), label: t.name || t.teamName, raw: t })), [teams]);

  useEffect(() => {
    Promise.allSettled([
      api.get("/roles"), 
      api.get("/branches"), 
      api.get("/teams"),
    ]).then(([rolesRes, branchesRes, teamsRes]) => {
      if (rolesRes.status === "fulfilled") setRoles(normalizeCollection(rolesRes.value.data));
      if (branchesRes.status === "fulfilled") setBranches(normalizeCollection(branchesRes.value.data));
      if (teamsRes.status === "fulfilled") setTeams(normalizeCollection(teamsRes.value.data));
    });
  }, []);

  const fetchUsers = () => {
    api.get("/users", {
      params: {
        page: currentPage - 1, 
        size: pageSize, 
        keyword: filters.keyword || null,
        // 1. Sửa 'role' thành 'roleId' và ép kiểu số
        roleId: filters.role === "ALL" ? null : Number(filters.role),
        status: filters.status === "ALL" ? null : filters.status,
        // 2. Không dùng join(","), gửi thẳng mảng số
        branchIds: filters.branchIds.length > 0 ? filters.branchIds.map(Number) : null,
        teamIds: filters.teamIds.length > 0 ? filters.teamIds.map(Number) : null,
      },
      // 3. Thêm paramsSerializer để Axios serialize mảng chuẩn cho Spring Boot
      paramsSerializer: { indexes: null }
    }).then((res) => {
      setUsers(normalizeCollection(res.data));
      setSelectedIndex(-1);
      setSelectedUserForRow(null);
      // 4. CẬP NHẬT CÁCH ĐỌC JSON PHÂN TRANG (Hỗ trợ cả chuẩn mới của Spring 3.3+ và chuẩn cũ)
      setTotalPages(res.data.page?.totalPages || res.data.totalPages || 1);
      setTotalElements(res.data.page?.totalElements || res.data.totalElements || 0);
    }).catch((err) => {
      const errorMessage = err.response?.data?.message || "Lỗi tải danh sách người dùng!";
      toast.error(errorMessage);
      console.error(err);
    });
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => fetchUsers(), 500);
    return () => clearTimeout(delayDebounce);
  }, [currentPage, pageSize, filters]);

  const handleOpenAdd = () => { setEditingUser(null); resetFormForShortcut(); setShowModal(true); };

  const handleEdit = (id) => {
    api.get(`/users/${id}`).then((res) => {
      const u = res.data;
      setForm({
        username: u.username || "", password: "", full_name: u.fullName || "", email: u.email || "", phone: u.phone || "",
        roleId: u.roleId || "", branchId: u.branchId || "", teamId: u.teamId || "", status: u.status || "ACTIVE",
      });
      setEditingUser(u);
      setShowModal(true);
    }).catch((err) => {
      const errorMessage = err.response?.data?.message || "Lỗi tải thông tin!";
      toast.error(errorMessage);
      console.error(err);
    });
  };

  const handleSubmit = () => {
    if (!form.roleId) return toast.error("Vui lòng chọn vai trò!");
    
    // Payload cho API cập nhật thông tin cơ bản
    const payload = {
      username: form.username, fullName: form.full_name, email: form.email, phone: form.phone,
      roleId: Number(form.roleId), branchId: toOptionalNumber(form.branchId), teamId: toOptionalNumber(form.teamId), status: form.status,
    };

    // Nếu là TẠO MỚI, gắn password vào payload chung
    if (!editingUser) {
      if (!form.password) return toast.error("Vui lòng nhập mật khẩu cho người dùng mới!");
      payload.password = form.password;
    }

    const request = editingUser ? api.put(`/users/${editingUser.id}`, payload) : api.post("/users", payload);
    
    // Thêm async vào .then để xử lý gọi API đổi pass tuần tự
    request.then(async () => { 
      
      // NẾU LÀ CẬP NHẬT VÀ CÓ NHẬP PASSWORD -> GỌI THÊM API CHANGE PASSWORD
      if (editingUser && form.password) {
        try {
          await api.put(`/users/${editingUser.id}/change-password`, {
            newPassword: form.password,
            confirmPassword: form.password // Tự động đồng bộ để vượt qua validate của Backend
          });
        } catch (err) {
          const errorMessage = err.response?.data?.message || "Đổi mật khẩu thất bại!";
          toast.error(`Cập nhật thông tin thành công nhưng: ${errorMessage}`);
          console.error(err);
          return; // Dừng lại, không đóng form để user biết lỗi
        }
      }

      toast.success(`${editingUser ? "Cập nhật" : "Tạo"} người dùng thành công!`);
      setShowModal(false); 
      fetchUsers();
    }).catch((err) => {
      const errorMessage = err.response?.data?.message || `Lỗi ${editingUser ? "cập nhật" : "tạo"} người dùng!`;
      toast.error(errorMessage);
      console.error(err);
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      api.delete(`/users/${id}`).then(() => { toast.success("Đã xóa!"); fetchUsers(); }).catch((err) => {
        const errorMessage = err.response?.data?.message || "Lỗi xóa!";
        toast.error(errorMessage);
        console.error(err);
      });
    }
  };

  // BỌC CHẶN PHÍM TẮT BẰNG QUYỀN
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
      if (showModal || isFilterSidebarOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => {
            const next = prev < users.length - 1 ? prev + 1 : prev;
            if (users[next]) setSelectedUserForRow(users[next]);
            return next;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => {
            const next = prev > 0 ? prev - 1 : 0;
            if (users[next]) setSelectedUserForRow(users[next]);
            return next;
          });
          break;
      }

      if (e.altKey) {
        if ((e.code === "KeyN" || e.key.toLowerCase() === "n") && canCreate) { e.preventDefault(); handleOpenAdd(); }
        if ((e.code === "KeyE" || e.key.toLowerCase() === "e") && canUpdate) { e.preventDefault(); if (selectedUserForRow) handleEdit(selectedUserForRow.id); }
        if ((e.code === "KeyD" || e.key.toLowerCase() === "d") && canDelete) { e.preventDefault(); if (selectedUserForRow && selectedUserForRow.id !== currentUserId) handleDelete(selectedUserForRow.id); }
        if ((e.code === "KeyV" || e.key.toLowerCase() === "v") && canView) { e.preventDefault(); if (selectedUserForRow) navigate(`/users/${selectedUserForRow.id}`); }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [users, selectedUserForRow, showModal, isFilterSidebarOpen, navigate, canCreate, canUpdate, canDelete, canView, currentUserId]);

  useEffect(() => {
    if (location.state?.editUserId && canUpdate) {
      handleEdit(location.state.editUserId);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate, canUpdate]);

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] space-y-4 relative overflow-hidden">
      <div className="shrink-0"><UserHeader onOpenAdd={handleOpenAdd} canCreate={canCreate} /></div>
      
      <UserTable
        users={users} 
        currentUserId={currentUserId}
        canView={canView}
        canUpdate={canUpdate}
        canDelete={canDelete}
        onOpenDetail={(u) => navigate(`/users/${u.id}`)} 
        onEdit={handleEdit} 
        onDelete={handleDelete}
        formatJoinedDate={(v) => v ? new Date(v).toLocaleDateString("vi-VN") : "-"}
        getInitials={(n) => n ? (n.split(" ")[0][0] + n.split(" ").pop()[0]).toUpperCase() : "U"}
        getRoleLabel={displayRoleLabel} 
        getBranchLabel={displayBranchLabel} 
        getTeamLabel={displayTeamLabel}
        tableContainerRef={tableContainerRef} 
        selectedUserForRow={selectedUserForRow}
        onRowClick={(u, idx) => { setSelectedUserForRow(u); setSelectedIndex(idx); }}
        currentPage={currentPage} totalPages={totalPages} totalElements={totalElements} setCurrentPage={setCurrentPage}
        pageSize={pageSize} setPageSize={setPageSize} onOpenFilter={() => setIsFilterSidebarOpen(true)}
      />

      <UserFilter
        isOpen={isFilterSidebarOpen} onClose={() => setIsFilterSidebarOpen(false)} filters={filters}
        onFilterTextChange={(f, v) => { setFilters(p => ({ ...p, [f]: v })); setCurrentPage(1); }}
        onFilterChange={(f, v) => { setFilters(p => ({ ...p, [f]: v })); setCurrentPage(1); }}
        onFilterArrayChange={(f, id) => {
          setFilters(p => ({ ...p, [f]: p[f].includes(id) ? p[f].filter(i => i !== id) : [...p[f], id] }));
          setCurrentPage(1);
        }}
        onClearFilters={() => setFilters({ keyword: "", role: "ALL", status: "ALL", branchIds: [], teamIds: [] })}
        roleOptions={roleOptions} branchOptions={branchOptions} teamOptions={teamOptions}
      />

      <UserFormModal
        isOpen={showModal} onClose={() => { setShowModal(false); resetFormForShortcut(); }}
        onSubmit={handleSubmit} editingUser={editingUser} form={form} setForm={setForm}
        roleOptions={roleOptions} branchOptions={branchOptions} teamOptions={teamOptions}
        currentUserId={currentUserId}
      />
    </div>
  );
}