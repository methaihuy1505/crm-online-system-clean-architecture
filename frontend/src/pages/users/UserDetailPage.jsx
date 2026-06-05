import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Edit,
  Fingerprint,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Users,
  Building2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../lib/api";

const STATUS_STYLE = {
  ACTIVE: "bg-blue-50 text-blue-700 border-blue-100",
  INACTIVE: "bg-slate-100 text-slate-600 border-slate-200",
};

const STATUS_LABEL = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Ngưng hoạt động",
};

const normalizeCollection = (data) => {
  const payload = data?.result ?? data?.content ?? data ?? [];
  return Array.isArray(payload) ? payload : [];
};

const getOptionLabel = (items, id, fallback) => {
  if (id === null || id === undefined || id === "") return fallback;
  const item = items.find((entry) => String(entry.id) === String(id));
  return (
    item?.roleName ||
    item?.role_name ||
    item?.name ||
    item?.code ||
    item?.label ||
    `${fallback} #${id}`
  );
};

const formatDateTime = (value) => {
  if (!value) return "---";
  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getInitials = (name) => {
  if (!name) return "U";
  const chunks = name.trim().split(" ");
  const first = chunks[0]?.[0] || "";
  const last = chunks[chunks.length - 1]?.[0] || "";
  return `${first}${last}`.toUpperCase();
};

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        navigate(-1);
      }
      if (e.altKey && (e.code === "KeyE" || e.key.toLowerCase() === "e")) {
        e.preventDefault();
        navigate("/users", { state: { editUserId: Number(id) } });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [id, navigate]);

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const [userRes, rolesRes, branchesRes, teamsRes] = await Promise.allSettled([
          api.get(`/users/${id}`),
          api.get("/roles"),
          api.get("/branches"),
          api.get("/teams"),
        ]);

        if (userRes.status !== "fulfilled") {
          throw userRes.reason;
        }

        setUser(userRes.value.data);
        if (rolesRes.status === "fulfilled") {
          setRoles(normalizeCollection(rolesRes.value.data));
        }
        if (branchesRes.status === "fulfilled") {
          setBranches(normalizeCollection(branchesRes.value.data));
        }
        if (teamsRes.status === "fulfilled") {
          setTeams(normalizeCollection(teamsRes.value.data));
        }
      } catch (err) {
        console.error(err);
        const errorMessage = err.response?.data?.message || "Không thể tải thông tin người dùng!";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const roleLabel = useMemo(
    () => getOptionLabel(roles, user?.roleId, "Chưa gán vai trò"),
    [roles, user?.roleId],
  );

  const branchLabel = useMemo(
    () => getOptionLabel(branches, user?.branchId, "Chưa gán chi nhánh"),
    [branches, user?.branchId],
  );

  const teamLabel = useMemo(
    () => getOptionLabel(teams, user?.teamId, "Chưa gán nhóm"),
    [teams, user?.teamId],
  );

  if (isLoading) {
    return <div className="p-8 font-medium text-slate-500">Đang tải dữ liệu...</div>;
  }

  if (!user) {
    return (
      <div className="p-8 font-medium text-red-500">
        Không tìm thấy người dùng.
      </div>
    );
  }

  return (
    <div className="space-y-6 flex-1">
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-black">
              {getInitials(user.fullName)}
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">
                {user.fullName || user.username || `Người dùng #${user.id}`}
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-slate-500 font-medium flex items-center gap-2">
                  <User size={16} /> {user.username || "---"}
                </span>
                <span
                  className={`px-3 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-widest ${
                    STATUS_STYLE[user.status] || "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {STATUS_LABEL[user.status] || user.status || "Không xác định"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-bold text-sm outline-none"
              type="button"
            >
              <ArrowLeft size={16} /> Quay lại (Esc)
            </button>
            <button
              onClick={() => navigate("/users", { state: { editUserId: user.id } })}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-bold text-sm shadow-md shadow-primary/20 outline-none"
              type="button"
            >
              <Edit size={16} /> Sửa thông tin (Alt+E)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b font-bold text-slate-800 bg-slate-50 uppercase tracking-wider text-xs">
              Thông tin chi tiết
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <InfoItem icon={<Fingerprint />} label="ID người dùng" value={user.id} />
              <InfoItem icon={<User />} label="Tên đăng nhập" value={user.username || "---"} />
              <InfoItem icon={<Mail />} label="Email" value={user.email || "---"} />
              <InfoItem icon={<Phone />} label="Số điện thoại" value={user.phone || "---"} />
              <InfoItem icon={<ShieldCheck />} label="Vai trò" value={roleLabel} />
              <InfoItem icon={<Calendar />} label="Ngày tạo" value={formatDateTime(user.createdAt)} />
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b font-bold text-slate-800 bg-slate-50 uppercase tracking-wider text-xs">
              Phạm vi truy cập
            </div>
            <div className="p-6 space-y-5">
              <InfoItem icon={<Building2 />} label="Chi nhánh" value={branchLabel} />
              <InfoItem icon={<Users />} label="Nhóm" value={teamLabel} />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

const InfoItem = ({ icon, label, value }) => (
  <div className="flex gap-3">
    <div className="text-slate-300 [&>svg]:w-5 [&>svg]:h-5 mt-0.5">{icon}</div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
        {label}
      </p>
      <p className="text-sm font-medium text-slate-800 break-words">{value}</p>
    </div>
  </div>
);
