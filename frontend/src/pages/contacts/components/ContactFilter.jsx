import React from "react";

const ContactFilter = ({ contacts = [] }) => {
  // Lấy danh sách duy nhất các Công ty và Chức danh từ DB
  const uniqueCompanies = [
    ...new Set(contacts.map((c) => c.customerName).filter(Boolean)),
  ];
  const uniqueJobTitles = [
    ...new Set(contacts.map((c) => c.jobTitle).filter(Boolean)),
  ];

  return (
    <div className="bg-surface-container-low rounded-xl p-6 mb-8 flex flex-wrap items-center gap-6">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
          Công ty / Khách hàng
        </label>
        <div className="relative">
          <select className="w-full bg-white border-none rounded-lg py-2.5 pl-4 pr-10 text-sm appearance-none focus:ring-1 focus:ring-primary/20 outline-none">
            <option value="">Tất cả công ty</option>
            {uniqueCompanies.map((company, idx) => (
              <option key={idx} value={company}>
                {company}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            expand_more
          </span>
        </div>
      </div>

      <div className="flex-1 min-w-[200px]">
        <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
          Chức danh
        </label>
        <div className="relative">
          <select className="w-full bg-white border-none rounded-lg py-2.5 pl-4 pr-10 text-sm appearance-none focus:ring-1 focus:ring-primary/20 outline-none">
            <option value="">Tất cả chức danh</option>
            {uniqueJobTitles.map((title, idx) => (
              <option key={idx} value={title}>
                {title}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            expand_more
          </span>
        </div>
      </div>

      <div className="flex items-end h-[62px]">
        <button className="h-[40px] px-6 bg-surface-container-highest text-primary font-bold text-sm rounded-lg hover:bg-surface-container-high transition-colors">
          Lọc kết quả
        </button>
      </div>
      <div className="flex items-end h-[62px]">
        <button
          className="h-[40px] px-3 text-slate-400 hover:text-error transition-colors"
          title="Xóa bộ lọc"
        >
          <span className="material-symbols-outlined">filter_list_off</span>
        </button>
      </div>
    </div>
  );
};

export default ContactFilter;
