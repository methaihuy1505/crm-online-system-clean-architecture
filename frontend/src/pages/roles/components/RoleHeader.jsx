import React from "react";
import { CirclePlus, Search, ShieldCheck } from "lucide-react";

const RoleHeader = ({ query, onQueryChange, onCreateRole }) => {
  return (
    <div className="flex flex-col gap-5 rounded-[24px] border border-slate-200 bg-white px-6 py-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] xl:flex-row xl:items-center xl:justify-between">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.34em] text-[#1A237E]">
          <ShieldCheck size={14} />
          Phân quyền hệ thống
        </div>
        <h1 className="text-2xl font-extrabold text-slate-950">
          Quản lý Vai trò & Phân quyền
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Kiểm soát quyền truy cập và bảo mật dữ liệu thông qua cấu hình vai trò chi tiết cho từng nhóm người dùng trong hệ thống CRM.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center xl:shrink-0">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Tìm kiếm vai trò..."
            className="h-11 w-full rounded-2xl border border-slate-200/90 bg-white px-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#1A237E] focus:ring-2 focus:ring-[#1A237E]/10 sm:w-80"
          />
        </div>
        <button
          type="button"
          onClick={onCreateRole}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#1A237E] px-5 text-sm font-semibold text-white shadow-lg shadow-[#1A237E]/25 transition hover:-translate-y-0.5 hover:bg-[#121a63]"
        >
          <CirclePlus size={18} />
          Tạo vai trò mới
        </button>
      </div>
    </div>
  );
};

export default RoleHeader;