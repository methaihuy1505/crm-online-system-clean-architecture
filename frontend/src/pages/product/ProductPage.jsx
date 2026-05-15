import { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";
const USAGES_ENDPOINT = `${API_BASE_URL}/voucher-usages`;
const USERS_ENDPOINT = `${API_BASE_URL}/users`;
const VOUCHERS_ENDPOINT = `${API_BASE_URL}/vouchers`;

function NavLink({ to, icon, label }) {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
        active
          ? "bg-indigo-600 text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <span className="text-base">{icon}</span>
      {label}
    </Link>
  );
}

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-56 shrink-0 bg-white border-r border-slate-200 flex flex-col py-6 px-3 gap-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-4 mb-3">
          Menu
        </p>
        <NavLink to="/users" icon="👤" label="Users" />
        <NavLink to="/vouchers" icon="🎟️" label="Vouchers" />
        <NavLink to="/voucher-usages" icon="📋" label="Voucher Usage" />
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}

const parseApiResponse = (res) => {
  const b = res?.data;
  if (b && typeof b === "object" && "success" in b) {
    if (b.success) return b.data;
    throw new Error(b.message || "Request failed");
  }
  return b;
};

const extract = (key) => (d) =>
  Array.isArray(d)
    ? d
    : Array.isArray(d?.data)
      ? d.data
      : Array.isArray(d?.[key])
        ? d[key]
        : [];

const formatDate = (s) => {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s;
  }
};

export default function VoucherUsagePage() {
  const [usages, setUsages] = useState([]);
  const [users, setUsers] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ userId: "", voucherId: "" });
  const [submitting, setSubmitting] = useState(false);

  const loadUsages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setUsages(
        extract("usages")(parseApiResponse(await axios.get(USAGES_ENDPOINT))),
      );
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      setUsers(
        extract("users")(parseApiResponse(await axios.get(USERS_ENDPOINT))),
      );
    } catch (e) {
      console.error(e);
    }
  }, []);

  const loadVouchers = useCallback(async () => {
    try {
      setVouchers(
        extract("vouchers")(
          parseApiResponse(await axios.get(VOUCHERS_ENDPOINT)),
        ),
      );
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    const loadUsages = async () => {
      setLoading(true);
      setError(null);
      try {
        setUsages(
          extract("usages")(parseApiResponse(await axios.get(USAGES_ENDPOINT))),
        );
      } catch (e) {
        setError(e.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    };
    const loadUsers = async () => {
      try {
        setUsers(
          extract("users")(parseApiResponse(await axios.get(USERS_ENDPOINT))),
        );
      } catch (e) {
        console.error(e);
      }
    };

    const loadVouchers = async () => {
      try {
        setVouchers(
          extract("vouchers")(
            parseApiResponse(await axios.get(VOUCHERS_ENDPOINT)),
          ),
        );
      } catch (e) {
        console.error(e);
      }
    };
    loadUsages();
    loadUsers();
    loadVouchers();
  }, [loadUsages, loadUsers, loadVouchers]);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userId || !formData.voucherId)
      return setError("Please select both user and voucher.");
    setSubmitting(true);
    setError(null);
    try {
      const res = await axios.post(USAGES_ENDPOINT, {
        userId: parseInt(formData.userId),
        voucherId: parseInt(formData.voucherId),
      });
      setUsages((p) => [...p, parseApiResponse(res)]);
      setFormData({ userId: "", voucherId: "" });
      await loadVouchers();
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getUserName = (id) => {
    const u = users.find((u) => u.id === id);
    return u ? u.fullname : `User ${id}`;
  };
  const getVoucherCode = (id) => {
    const v = vouchers.find((v) => v.id === id);
    return v ? v.code : `Voucher ${id}`;
  };

  const activeVouchers = vouchers.filter((v) => v.status === "ACTIVE");

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Voucher Usage</h1>
            <p className="text-sm text-slate-500 mt-1">
              Record and track voucher redemptions
            </p>
          </div>
          <button
            onClick={() => {
              loadUsages();
              loadUsers();
              loadVouchers();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            <span>⚠️</span> {error}
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Total Usages",
              value: usages.length,
              color: "bg-indigo-50 text-indigo-700",
            },
            {
              label: "Active Vouchers",
              value: activeVouchers.length,
              color: "bg-emerald-50 text-emerald-700",
            },
            {
              label: "Total Users",
              value: users.length,
              color: "bg-amber-50 text-amber-700",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-slate-200 p-5"
            >
              <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color.split(" ")[1]}`}>
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 h-fit">
            <h2 className="text-base font-semibold text-slate-800 mb-5">
              🎟️ Use a Voucher
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  User
                </label>
                <select
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  required
                  className="px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                >
                  <option value="">Select a user…</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullname} — {u.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Voucher
                </label>
                <select
                  name="voucherId"
                  value={formData.voucherId}
                  onChange={handleChange}
                  required
                  className="px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                >
                  <option value="">Select a voucher…</option>
                  {activeVouchers.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.code} — {v.discountPercent}% off (Qty: {v.quantity})
                    </option>
                  ))}
                </select>
                {activeVouchers.length === 0 && (
                  <p className="text-xs text-slate-400">
                    No active vouchers available
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors mt-2"
              >
                {submitting ? "Applying…" : "Apply Voucher"}
              </button>
            </form>
          </div>

          {/* History Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-fit">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-800">
                Usage History
              </h2>
              <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                {usages.length} records
              </span>
            </div>
            {loading ? (
              <div className="py-16 text-center text-slate-400 text-sm">
                ⏳ Loading…
              </div>
            ) : usages.length === 0 ? (
              <div className="py-16 flex flex-col items-center text-slate-400 gap-2">
                <span className="text-4xl">📭</span>
                <p className="text-sm">No usage history yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs font-medium text-slate-500 uppercase tracking-wider bg-slate-50">
                      {["ID", "User", "Voucher", "Used At"].map((h) => (
                        <th key={h} className="px-6 py-3 text-left">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usages.map((u, i) => (
                      <tr
                        key={u.id ?? i}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                          #{u.id ?? "—"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center justify-center shrink-0">
                              {getUserName(u.userId).charAt(0).toUpperCase()}
                            </div>
                            <span className="text-slate-800">
                              {getUserName(u.userId)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded">
                            {getVoucherCode(u.voucherId)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs">
                          {formatDate(u.usedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
