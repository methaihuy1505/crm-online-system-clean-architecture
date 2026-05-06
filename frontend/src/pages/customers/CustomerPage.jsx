import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerHeader from "./components/CustomerHeader";
import CustomerStats from "./components/CustomerStats";
import CustomerFilter from "./components/CustomerFilter";
import CustomerTable from "./components/CustomerTable";
import CustomerFormModal from "./components/CustomerFormModal";

const CustomerPage = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Danh mục
  const [statuses, setStatuses] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [sources, setSources] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  // Lọc
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const initialFilters = {
    keyword: "",
    isOrganization: "",
    statusIds: [],
    rankIds: [],
    sourceIds: [],
    campaignIds: [],
  };
  const [filters, setFilters] = useState(initialFilters);

  // UI & Phím tắt
  const [selectedCustomerForRow, setSelectedCustomerForRow] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);

  // === PHÍM TẮT TOÀN CỤC ===
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey) {
        if (e.code === "KeyN" || e.key.toLowerCase() === "n") {
          e.preventDefault();
          handleOpenAdd();
        }
        if (e.code === "KeyE" || e.key.toLowerCase() === "e") {
          e.preventDefault();
          if (selectedCustomerForRow) handleOpenEdit(selectedCustomerForRow);
        }
        if (e.code === "KeyD" || e.key.toLowerCase() === "d") {
          e.preventDefault();
          if (selectedCustomerForRow)
            handleDelete(
              selectedCustomerForRow.id,
              selectedCustomerForRow.name,
            );
        }
        if (e.code === "KeyV" || e.key.toLowerCase() === "v") {
          e.preventDefault();
          if (selectedCustomerForRow) handleOpenDetail(selectedCustomerForRow);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedCustomerForRow]);

  useEffect(() => {
    const fetchDictionaries = async () => {
      try {
        const [statRes, rankRes, srcRes, campRes] = await Promise.all([
          axios.get("http://localhost:8080/api/v1/customer-statuses"),
          axios.get("http://localhost:8080/api/v1/customer-ranks"),
          axios.get("http://localhost:8080/api/v1/sources"),
          axios.get("http://localhost:8080/api/v1/campaigns/options"),
        ]);
        setStatuses(statRes.data);
        setRanks(rankRes.data);
        setSources(srcRes.data);
        setCampaigns(campRes.data);
      } catch (error) {
        console.error("Lỗi:", error);
      }
    };
    fetchDictionaries();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCustomers();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [currentPage, pageSize, filters]);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage - 1,
        size: pageSize,
        keyword: filters.keyword || null,
        isOrganization: filters.isOrganization || null,
        statusIds:
          filters.statusIds.length > 0 ? filters.statusIds.join(",") : null,
        rankIds: filters.rankIds.length > 0 ? filters.rankIds.join(",") : null,
        sourceIds:
          filters.sourceIds.length > 0 ? filters.sourceIds.join(",") : null,
        campaignIds:
          filters.campaignIds.length > 0 ? filters.campaignIds.join(",") : null,
      };

      const res = await axios.get("http://localhost:8080/api/v1/customers", {
        params,
      });
      setCustomers(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDetail = (customer) => {
    navigate(`/customers/${customer.id}`);
  };
  const handleOpenAdd = () => {
    setCustomerToEdit(null);
    setIsFormOpen(true);
  };
  const handleOpenEdit = (customer) => {
    setCustomerToEdit(customer);
    setIsFormOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Xóa mềm Khách hàng "${name}"?`)) {
      try {
        await axios.delete(`http://localhost:8080/api/v1/customers/${id}`);
        fetchCustomers();
        setSelectedCustomerForRow(null);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleFilterTextChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleFilterArrayChange = (field, id) => {
    setFilters((prev) => {
      const currentArray = prev[field];
      if (currentArray.includes(id))
        return { ...prev, [field]: currentArray.filter((item) => item !== id) };
      return { ...prev, [field]: [...currentArray, id] };
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  const renderActiveFilterTags = () => {
    const activeTags = [];
    if (filters.keyword)
      activeTags.push({
        type: "text",
        key: "keyword",
        label: `Tìm: ${filters.keyword}`,
      });
    if (filters.isOrganization !== "")
      activeTags.push({
        type: "text",
        key: "isOrganization",
        label: `Loại: ${filters.isOrganization === "true" ? "Tổ chức" : "Cá nhân"}`,
      });

    filters.statusIds.forEach((id) => {
      const obj = statuses.find((s) => s.id.toString() === id);
      if (obj)
        activeTags.push({
          type: "array",
          field: "statusIds",
          id: id,
          label: `Trạng thái: ${obj.name}`,
        });
    });
    filters.rankIds.forEach((id) => {
      const obj = ranks.find((r) => r.id.toString() === id);
      if (obj)
        activeTags.push({
          type: "array",
          field: "rankIds",
          id: id,
          label: `Hạng: ${obj.name}`,
        });
    });
    filters.sourceIds.forEach((id) => {
      const obj = sources.find((s) => s.id.toString() === id);
      if (obj)
        activeTags.push({
          type: "array",
          field: "sourceIds",
          id: id,
          label: `Nguồn: ${obj.name}`,
        });
    });
    filters.campaignIds.forEach((id) => {
      const obj = campaigns.find((c) => c.id.toString() === id);
      if (obj)
        activeTags.push({
          type: "array",
          field: "campaignIds",
          id: id,
          label: `Chiến dịch: ${obj.name}`,
        });
    });

    if (activeTags.length === 0) return null;

    return (
      <div className="flex gap-2 mb-4 items-center flex-wrap">
        <span className="text-sm font-semibold text-slate-500">Đang lọc:</span>
        {activeTags.map((tag, index) => (
          <div
            key={index}
            className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs flex items-center gap-1 font-bold"
          >
            {tag.label}
            <button
              onClick={() =>
                tag.type === "array"
                  ? handleFilterArrayChange(tag.field, tag.id)
                  : handleFilterTextChange(tag.key, "")
              }
              className="hover:text-red-500 ml-1 outline-none"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={clearFilters}
          className="text-xs text-error font-bold ml-2 hover:underline"
        >
          Xóa tất cả
        </button>
      </div>
    );
  };

  const stats = {
    totalB2B: customers.filter((c) => c.isOrganization).length,
    totalB2C: customers.filter((c) => !c.isOrganization).length,
    totalDiamond: customers.filter((c) => c.rankName === "Kim cương").length,
  };

  return (
    <div className="space-y-6 relative flex-1">
      <CustomerHeader
        totalCustomers={totalElements}
        onOpenAdd={handleOpenAdd}
      />
      <CustomerStats stats={stats} />
      {renderActiveFilterTags()}

      <CustomerTable
        customers={customers}
        isLoading={isLoading}
        onOpenDetail={handleOpenDetail}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        onRowClick={setSelectedCustomerForRow}
        selectedCustomerForRow={selectedCustomerForRow}
        onOpenFilter={() => setIsFilterSidebarOpen(true)}
      />

      <CustomerFilter
        isOpen={isFilterSidebarOpen}
        onClose={() => setIsFilterSidebarOpen(false)}
        filters={filters}
        onFilterTextChange={handleFilterTextChange}
        onFilterArrayChange={handleFilterArrayChange}
        clearFilters={clearFilters}
        statuses={statuses}
        ranks={ranks}
        sources={sources}
        campaigns={campaigns}
      />

      <CustomerFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={customerToEdit}
        onSuccess={fetchCustomers}
        statuses={statuses}
        ranks={ranks}
        sources={sources}
        campaigns={campaigns}
      />
    </div>
  );
};

export default CustomerPage;
