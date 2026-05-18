  import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./User.css";
import UserTable from "./UserTable";

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({
    keyword: "",
    role: "ALL",
    status: "ALL",
  });
  const [form, setForm] = useState({
    username: "",
    password: "",
    full_name: "",
    email: "",
    phone: "",
  });

  const fetchUsers = () => {
    axios
      .get("/api/users")
      .then((res) => {
        const payload = res.data?.result ?? res.data ?? [];
        setUsers(Array.isArray(payload) ? payload : []);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  const filteredUsers = useMemo(() => {
    const kw = filters.keyword.trim().toLowerCase();
    return users.filter((u) => {
      const roleName = (u.role?.role_name || "").toLowerCase();
      const userStatus = (u.status || "").toUpperCase();
      const textBlob = `${u.full_name || ""} ${u.username || ""} ${u.email || ""}`.toLowerCase();

      const matchKeyword = !kw || textBlob.includes(kw);
      const matchRole = filters.role === "ALL" || roleName === filters.role.toLowerCase();
      const matchStatus = filters.status === "ALL" || userStatus === filters.status;

      return matchKeyword && matchRole && matchStatus;
    });
  }, [users, filters]);

  const roleOptions = useMemo(() => {
    const unique = new Set(
      users
        .map((u) => u.role?.role_name)
        .filter(Boolean)
        .map((name) => name.toUpperCase()),
    );
    return ["ALL", ...Array.from(unique)];
  }, [users]);

  const resetForm = () => {
    setForm({
      username: "",
      password: "",
      full_name: "",
      email: "",
      phone: "",
    });
  };

  const openCreateModal = () => {
    setEditingId(null);
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (id) => {
    axios
      .get(`/api/users/${id}`)
      .then((res) => {
        const u = res.data;
        setForm({
          username: u.username || "",
          password: "",
          full_name: u.full_name || "",
          email: u.email || "",
          phone: u.phone || "",
        });
        setEditingId(id);
        setShowModal(true);
      })
      .catch((err) => console.error(err));
  };

  const handleUpdateUser = () => {
    const payload = {
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
    };

    if (form.password) {
      payload.password = form.password;
    }

    axios
      .put(`/api/users/${editingId}`, payload)
      .then(() => {
        setShowModal(false);
        setEditingId(null);
        resetForm();
        fetchUsers();
      })
      .catch((err) => console.error(err));
  };

  const handleCreateUser = () => {
    const payload = {
      username: form.username,
      password: form.password,
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
    };

    axios
      .post("/api/users", payload)  
      .then(() => {
        setShowModal(false);
        resetForm();
        fetchUsers();
      })
      .catch((err) => {
        console.error("Create user failed:", err);
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      return;
    }

    axios
      .delete(`/api/users/${id}`)
      .then(() => fetchUsers())
      .catch((err) => console.error(err));
  };

  const formatUserCode = (id) => `#USR-${String(id).padStart(4, "0")}`;

  const formatJoinedDate = (value) => {
    if (!value) {
      return "-";
    }
    return new Date(value).toLocaleDateString("vi-VN", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getInitials = (name) => {
    if (!name) {
      return "U";
    }
    const chunks = name.trim().split(" ");
    const first = chunks[0]?.[0] || "";
    const last = chunks[chunks.length - 1]?.[0] || "";
    return `${first}${last}`.toUpperCase();
  };

  const activeCount = filteredUsers.filter((u) => u.status === "ACTIVE").length;
  const growth = users.length === 0 ? 0 : Math.round((activeCount / users.length) * 100);

  return (
    <div className="space-y-8 flex-1 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-headline font-extrabold text-primary tracking-tight">
            Quản lý người dùng
          </h2>
          <p className="text-on-surface-variant mt-1">
            Quản lý tài khoản nội bộ, vai trò và phạm vi truy cập trong hệ thống.
          </p>
        </div>
        <button
          className="bg-gradient-to-br from-[#000666] to-[#1A237E] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
          onClick={openCreateModal}
          type="button"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          <span>Thêm người dùng</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4 items-stretch">
        <div className="bg-surface-container-low rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">
            <span>Tổng người dùng</span>
            <span className="material-symbols-outlined text-primary text-lg">groups</span>
          </div>
          <div className="flex items-end gap-3 mt-4">
            <h3 className="text-4xl font-headline font-extrabold text-on-surface">{filteredUsers.length}</h3>
            <span className="text-primary text-sm font-semibold">+{growth}%</span>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">
              Vai trò
            </label>
            <div className="relative">
              <select
                value={filters.role}
                onChange={(e) => setFilters((prev) => ({ ...prev, role: e.target.value }))}
                className="user-filter-select w-full bg-surface-container-lowest border border-surface-variant/60 rounded-lg text-sm px-3 py-2.5 pr-10"
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role === "ALL" ? "Tất cả vai trò" : role}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined user-filter-chevron" aria-hidden="true">
                expand_more
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1">
              Trạng thái
            </label>
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                className="user-filter-select w-full bg-surface-container-lowest border border-surface-variant/60 rounded-lg text-sm px-3 py-2.5 pr-10"
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="INACTIVE">Ngưng hoạt động</option>
              </select>
              <span className="material-symbols-outlined user-filter-chevron" aria-hidden="true">
                expand_more
              </span>
            </div>
          </div>

          <div className="relative">
            <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-1 mb-1.5">
              Tìm kiếm
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-outline">search</span>
              <input
                type="text"
                value={filters.keyword}
                onChange={(e) => setFilters((prev) => ({ ...prev, keyword: e.target.value }))}
                placeholder="Tìm tên, email hoặc username..."
                className="w-full bg-surface-container-lowest border border-surface-variant/60 rounded-lg text-sm pl-9 pr-10 py-2.5"
              />
              <button
                onClick={() => setFilters({ keyword: "", role: "ALL", status: "ALL" })}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md text-on-surface-variant hover:bg-surface-container-high"
                title="Xóa bộ lọc"
                type="button"
              >
                <span className="material-symbols-outlined text-base">tune</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <UserTable
        users={users}
        filteredUsers={filteredUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        formatUserCode={formatUserCode}
        formatJoinedDate={formatJoinedDate}
        getInitials={getInitials}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
        <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest border-l-4 border-primary shadow-sm p-7">
          <h3 className="text-3xl font-headline font-extrabold text-primary">Kiểm tra phân quyền người dùng</h3>
          <p className="mt-3 text-on-surface-variant max-w-2xl leading-relaxed">
            Thực hiện rà soát toàn bộ tài khoản đang hoạt động để đảm bảo xác thực đa lớp và quyền truy cập đúng vai trò.
          </p>
          <button
            className="mt-6 bg-gradient-to-br from-[#000666] to-[#1A237E] text-white px-6 py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-primary/20 transition-all"
            type="button"
          >
            Bắt đầu kiểm tra
          </button>
          <span className="material-symbols-outlined absolute right-5 bottom-4 text-[92px] text-primary/15">
            verified_user
          </span>
        </div>

        <div className="rounded-xl bg-surface-container-lowest border-l-4 border-secondary-container p-6 border border-surface-variant/40 shadow-sm">
          <h4 className="font-headline font-bold text-xl text-on-surface">Tình trạng hệ thống</h4>
          <p className="mt-3 text-sm text-on-surface-variant leading-6">
            Có 3 tài khoản đang bị gắn cờ do hành vi đăng nhập bất thường. Vui lòng kiểm tra ở mục Bảo mật.
          </p>
          <button className="mt-5 text-primary font-semibold underline underline-offset-4" type="button">
            Xem nhật ký bảo mật
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[9999] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-surface-container-lowest shadow-2xl p-6 md:p-7 max-h-[90vh] overflow-y-auto user-modal-scroll relative">
            <button
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
              onClick={() => setShowModal(false)}
              type="button"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            <h3 className="text-2xl font-headline font-extrabold text-primary pr-10">
              {editingId ? "Cập nhật thông tin người dùng" : "Tạo mới người dùng"}
            </h3>
            <p className="text-on-surface-variant mt-1">
              Điền thông tin tài khoản và cấu hình quyền truy cập phù hợp.
            </p>

            <div className="mt-6 space-y-5">
              <section>
                <h4 className="text-xs tracking-widest uppercase font-bold text-on-surface-variant mb-3">
                  Bảo mật tài khoản
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-on-surface-variant">Tên đăng nhập</label>
                    <input
                      value={form.username}
                      disabled={editingId !== null}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      className="w-full rounded-lg border border-surface-variant/70 bg-surface-container-low px-3 py-2.5 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-on-surface-variant">Mật khẩu</label>
                    <input
                      type="password"
                      placeholder={editingId ? "Để trống nếu giữ nguyên mật khẩu cũ" : ""}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full rounded-lg border border-surface-variant/70 bg-surface-container-low px-3 py-2.5 text-sm"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h4 className="text-xs tracking-widest uppercase font-bold text-on-surface-variant mb-3">
                  Thông tin hồ sơ
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-on-surface-variant">Họ và tên</label>
                    <input
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      className="w-full rounded-lg border border-surface-variant/70 bg-surface-container-low px-3 py-2.5 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-on-surface-variant">Email</label>
                    <input
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-lg border border-surface-variant/70 bg-surface-container-low px-3 py-2.5 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-on-surface-variant">Số điện thoại</label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-lg border border-surface-variant/70 bg-surface-container-low px-3 py-2.5 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-on-surface-variant">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full rounded-lg border border-surface-variant/70 bg-surface-container-low px-3 py-2.5 text-sm"
                    >
                      <option value="ACTIVE">Đang hoạt động</option>
                      <option value="INACTIVE">Ngưng hoạt động</option>
                    </select>
                  </div>
                </div>
              </section>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  className="px-4 py-2.5 rounded-lg border border-surface-variant text-on-surface-variant"
                  onClick={() => setShowModal(false)}
                  type="button"
                >
                  Hủy
                </button>
                <button
                  className="px-5 py-2.5 rounded-lg bg-primary text-white font-semibold"
                  onClick={() => (editingId ? handleUpdateUser() : handleCreateUser())}
                  type="button"
                >
                  {editingId ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}