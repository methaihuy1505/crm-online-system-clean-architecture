import React, { useState, useEffect, useRef } from "react";
import api from "../../lib/api";
import { X, Search as SearchIcon } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Mặc định", value: "" },
  { label: "Giá cao → thấp", value: "price_desc" },
  { label: "Giá thấp → cao", value: "price_asc" },
  { label: "Tên A → Z", value: "name_asc" },
  { label: "Tên Z → A", value: "name_desc" },
];

const PRODUCT_TYPE_OPTIONS = [
  { label: "Tất cả", value: "" },
  { label: "Vật lý", value: "PHYSICAL" },
  { label: "Dịch vụ", value: "SERVICE" },
  { label: "Kỹ thuật số", value: "DIGITAL" },
];

function RadioButtonGroup({ options, selected, onChange, cols = 2 }) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {options.map((opt) => {
        const active = selected === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-2 py-2 rounded-xl text-[10px] font-bold border transition-all text-center leading-tight outline-none ${
              active ? "bg-[#1a237e] text-white border-[#1a237e] shadow-sm" : "bg-white text-slate-500 border-slate-200 hover:border-[#1a237e] hover:text-[#1a237e]"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function CheckboxButtonGroup({ items, selected, onChange, cols = 2 }) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {items.length === 0 ? (
        <p className="text-xs text-slate-400 italic col-span-full">Đang tải...</p>
      ) : (
        items.map((item) => {
          const checked = selected.includes(item.value);
          return (
            <button
              key={item.value}
              onClick={() => onChange(checked ? selected.filter((v) => v !== item.value) : [...selected, item.value])}
              className={`px-2 py-2 rounded-xl text-[10px] font-bold border transition-all text-center truncate outline-none ${
                checked ? "bg-[#1a237e] text-white border-[#1a237e] shadow-md" : "bg-white text-slate-500 border-slate-200 hover:border-[#1a237e] hover:text-[#1a237e]"
              }`}
              title={item.label}
            >
              {item.label}
            </button>
          );
        })
      )}
    </div>
  );
}

// COMPONENT: TÌM KIẾM BẤT ĐỒNG BỘ NHIỀU LỰA CHỌN (DÀNH CHO BỘ LỌC)
function CategoryAsyncMultiSelect({ selectedIds, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]); 
  const wrapperRef = useRef(null);

  // Đóng khi click ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Nếu props reset (vd bấm Xóa tất cả), thì reset tags UI
  useEffect(() => {
    if (selectedIds.length === 0) setSelectedTags([]);
  }, [selectedIds]);

  // Lấy dữ liệu API khi gõ (Debounce)
  useEffect(() => {
    if (!isOpen) return;
    const fetchCats = async () => {
      setLoading(true);
      try {
        const res = await api.get("/product-categories", { params: { search: searchTerm, page: 0, size: 20 }});
        setOptions(res.data.content || res.data || []);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    const timer = setTimeout(fetchCats, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, isOpen]);

  const toggleCategory = (cat) => {
    const isSelected = selectedIds.includes(String(cat.id));
    if (isSelected) {
      onChange(selectedIds.filter(id => id !== String(cat.id)));
      setSelectedTags(selectedTags.filter(t => t.id !== String(cat.id)));
    } else {
      onChange([...selectedIds, String(cat.id)]);
      setSelectedTags([...selectedTags, { id: String(cat.id), name: cat.name }]);
    }
  };

  const removeTag = (id) => {
    onChange(selectedIds.filter(v => v !== id));
    setSelectedTags(selectedTags.filter(t => t.id !== id));
  }

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Hiển thị các danh mục đã chọn thành Tag */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selectedTags.map(tag => (
            <span key={tag.id} className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
              {tag.name}
              <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => removeTag(tag.id)} />
            </span>
          ))}
        </div>
      )}

      {/* Nút giả làm thẻ Input */}
      <div
        className="bg-white border border-slate-200 hover:border-[#1a237e] rounded-xl px-3 py-2 text-xs flex items-center justify-between cursor-pointer transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <span className="text-slate-400">Gõ để tìm danh mục...</span>
        <SearchIcon size={14} className="text-slate-400" />
      </div>

      {/* Menu thả xuống */}
      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 flex flex-col overflow-hidden">
          <div className="p-2 border-b border-slate-100 flex items-center bg-slate-50">
            <SearchIcon size={14} className="text-slate-400 mr-2" />
            <input
              type="text"
              className="w-full bg-transparent border-none outline-none text-xs placeholder:text-slate-400"
              placeholder="Tìm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <ul className="overflow-y-auto flex-1 p-1 custom-scrollbar">
            {loading ? (
              <li className="px-3 py-2 text-[10px] text-slate-500 text-center italic">Đang tìm kiếm...</li>
            ) : options.length > 0 ? (
              options.map(cat => {
                const checked = selectedIds.includes(String(cat.id));
                return (
                  <li
                    key={cat.id}
                    className={`px-3 py-2 text-xs cursor-pointer rounded-md truncate transition-colors font-semibold ${checked ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50"}`}
                    onClick={() => toggleCategory(cat)}
                  >
                    {cat.name}
                  </li>
                )
              })
            ) : (
              <li className="px-3 py-2 text-[10px] text-slate-500 text-center italic">Không tìm thấy.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ProductFilterPanel({ filters, onChange, onClose }) {
  const [uoms, setUoms] = useState([]);

  // KHÔNG CÒN GET PRODUCT-CATEGORIES Ở ĐÂY NỮA
  useEffect(() => {
    api.get("/uoms").then((uomRes) => {
      setUoms(uomRes.data.map((u) => ({ label: u.name, value: String(u.id) })));
    });
  }, []);

  const handleReset = () =>
    onChange({
      search: "", sort: "", productType: "", categoryIds: [], uomIds: [],
    });

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-4 animate-fade-in relative">
      <button onClick={onClose} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 outline-none">
        <X size={18} />
      </button>

      <h3 className="text-[10px] font-black uppercase text-[#1A237E] mb-4">Bộ lọc nâng cao</h3>

      <div className="space-y-4">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Sắp xếp</p>
          <RadioButtonGroup options={SORT_OPTIONS} selected={filters.sort} onChange={(v) => onChange({ ...filters, sort: v })} cols={2} />
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Loại sản phẩm</p>
          <RadioButtonGroup options={PRODUCT_TYPE_OPTIONS} selected={filters.productType} onChange={(v) => onChange({ ...filters, productType: v })} cols={2} />
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Danh mục</p>
          {/* THAY THẾ CheckboxButtonGroup BẰNG Async Search Dropdown */}
          <CategoryAsyncMultiSelect selectedIds={filters.categoryIds} onChange={(v) => onChange({ ...filters, categoryIds: v })} />
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Đơn vị tính</p>
          <CheckboxButtonGroup items={uoms} selected={filters.uomIds} onChange={(v) => onChange({ ...filters, uomIds: v })} cols={2} />
        </div>

        <button onClick={handleReset} className="w-full py-2 text-[11px] font-bold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-all outline-none mt-2">
          Xóa tất cả bộ lọc
        </button>
      </div>
    </div>
  );
}