import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import toast from "react-hot-toast";

import TaskListHeader from "./components/TaskListHeader";
import { TaskTable } from "./components/tables/TaskTable";
import TaskFormModal from "./components/TaskFormModal";
import TaskNoteSection from "./components/TaskNoteSection";
import TaskFilter from "./components/TaskFilter";

import { usePermission } from "../../hooks/usePermission";

const TaskList = () => {
  const navigate = useNavigate();

  const { hasPermission } = usePermission();
  const canView = hasPermission("tasks.view");
  const canCreate = hasPermission("tasks.create");
  const canUpdate = hasPermission("tasks.update");
  const canDelete = hasPermission("tasks.delete");

  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || { id: 1, roleId: 3 };
  const currentUserId = parseInt(currentUser.id, 10);

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    priority: [],
    relateType: [],
    isOverdue: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50); 
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  
  const [isTaskNoteModalOpen, setIsTaskNoteModalOpen] = useState(false);
  const [selectedTaskIdForNote, setSelectedTaskIdForNote] = useState(null);

  // STATE ĐỂ CHẠY MŨI TÊN
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const tableContainerRef = useRef(null);

  const activeFiltersCount = 
    filters.status.length + filters.priority.length + filters.relateType.length + filters.isOverdue.length;

  const fetchCombinedTasks = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage - 1, 
        size: pageSize,
        sort: "id,desc", 
        relateType: filters.relateType.length > 0 ? filters.relateType : null,
        priority: filters.priority.length > 0 ? filters.priority : null,
        status: filters.status.length > 0 ? filters.status : null,
        isOverdue: filters.isOverdue.length > 0 ? filters.isOverdue : null,
        keyword: keyword.trim() || null
      };

      const response = await api.get("/tasks/advanced-search", { 
        params,
        paramsSerializer: { indexes: null }
      });
      
      const responseData = response.data;
      const dataList = responseData.data || responseData.content || [];
      
      setTasks(dataList);
      setTotalPages(responseData.totalPages || 1);
      setTotalElements(responseData.totalElements || 0);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Không thể tải danh sách công việc.";
      toast.error(errorMessage);
      console.error(err);
    
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCombinedTasks();
  }, [currentPage, pageSize, filters, keyword]);

  // RESET KHI DATA ĐỔI
  useEffect(() => {
    setSelectedIndex(-1);
    setSelectedTask(null);
  }, [tasks]);

  // FIX LỖI 2 & 4: MŨI TÊN VÀ PHÍM TẮT
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Đang focus nhập chữ thì ko bắt phím tắt
      if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
      if (isModalOpen || isFilterOpen || isTaskNoteModalOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => {
            const next = prev < tasks.length - 1 ? prev + 1 : prev;
            if (tasks[next]) setSelectedTask(tasks[next]);
            return next;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => {
            const next = prev > 0 ? prev - 1 : 0;
            if (tasks[next]) setSelectedTask(tasks[next]);
            return next;
          });
          break;
      }

      // ALT + Phím tắt thao tác
      if (e.altKey) {
        if ((e.key.toLowerCase() === "n" || e.code === "KeyN") && canCreate) {
          e.preventDefault();
          openModal(null);
        }
        if ((e.key.toLowerCase() === "e" || e.code === "KeyE") && canUpdate && selectedTask) {
          e.preventDefault();
          openModal(selectedTask);
        }
        if ((e.key.toLowerCase() === "d" || e.code === "KeyD") && canDelete && selectedTask) {
          e.preventDefault();
          handleDelete(selectedTask.id);
        }
        if ((e.key.toLowerCase() === "v" || e.code === "KeyV") && canView && selectedTask) {
          e.preventDefault();
          navigate(`/tasks/${selectedTask.id}`);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [tasks, selectedTask, isModalOpen, isFilterOpen, isTaskNoteModalOpen, canCreate, canUpdate, canDelete, canView, navigate]);

  // AUTO SCROLL KHUNG BẢNG KHI BẤM MŨI TÊN
  useEffect(() => {
    if (selectedIndex === -1 || !tableContainerRef.current) return;
    const activeRow = tableContainerRef.current.querySelector(`tr[data-index="${selectedIndex}"]`);
    if (activeRow) {
      const container = tableContainerRef.current;
      const rowTop = activeRow.offsetTop;
      const rowBottom = rowTop + activeRow.offsetHeight;
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;

      if (rowTop < containerTop) {
        container.scrollTo({ top: rowTop, behavior: "smooth" });
      } else if (rowBottom > containerBottom) {
        container.scrollTo({ top: rowBottom - container.clientHeight, behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  const handleQuickUpdateStatus = async (task, newStatus) => {
    try {
      const payload = {
        ...task,
        status: newStatus,
        title: task.title || "Công việc không có tiêu đề",
        startDate: task.startDate || new Date().toISOString(),
        endDate: task.endDate || new Date().toISOString(),
        priority: task.priority || "MEDIUM", 
        relateType: task.relateType || "CUSTOMER",
        relateId: task.relateId ? parseInt(task.relateId, 10) : null,
        assignedTo: task.assignedTo ? parseInt(task.assignedTo, 10) : null,
        createdBy: task.createdBy,
        updatedBy: currentUserId,
        extensionCount: parseInt(task.extensionCount || 0, 10)
      };
      await api.put(`/tasks/${task.id}`, payload);
      toast.success("Cập nhật trạng thái công việc thành công!");
      fetchCombinedTasks(); 
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Không thể cập nhật trạng thái công việc.";
      toast.error(errorMessage);
      console.error(err);
      
    }
  };

  const handleQuickUpdatePriority = async (task, newPriority) => {
    try {
      const payload = {
        ...task,
        priority: newPriority,
        title: task.title || "Công việc không có tiêu đề",
        startDate: task.startDate || new Date().toISOString(),
        endDate: task.endDate || new Date().toISOString(),
        status: task.status || "NOT_STARTED",
        relateType: task.relateType || "CUSTOMER", 
        relateId: task.relateId ? parseInt(task.relateId, 10) : null, 
        assignedTo: task.assignedTo ? parseInt(task.assignedTo, 10) : null, 
        createdBy: task.createdBy,
        updatedBy: currentUserId,
        extensionCount: parseInt(task.extensionCount || 0, 10)
      };
      await api.put(`/tasks/${task.id}`, payload);
      toast.success("Cập nhật mức độ ưu tiên thành công!");
      fetchCombinedTasks(); 
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Không thể cập nhật mức độ ưu tiên.";
      toast.error(errorMessage);
      console.error(err);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1); 
  };

  const clearFilters = () => {
    setFilters({ status: [], priority: [], relateType: [], isOverdue: [] });
    setKeyword("");
    setCurrentPage(1);
  };

  const openModal = (task = null) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa công việc này?")) {
      try {
        await api.delete(`/tasks/${id}`);
        toast.success("Xóa công việc thành công!");
        fetchCombinedTasks();
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Xóa công việc thất bại!";
        toast.error(errorMessage);
        console.error(err);
      }
    }
  };

  const handleOpenNotesSection = (taskId) => {
    setSelectedTaskIdForNote(taskId);
    setIsTaskNoteModalOpen(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] space-y-4 relative overflow-hidden text-[11px]">

      <div className="shrink-0">
        <TaskListHeader
          keyword={keyword}
          setKeyword={(val) => { setKeyword(val); setCurrentPage(1); }}
          openModal={() => openModal(null)}
          onOpenFilter={() => setIsFilterOpen(true)}
          activeFiltersCount={activeFiltersCount}
          canCreate={canCreate}
        />
      </div>

      <TaskTable
        tasks={tasks}
        isLoading={isLoading}
        navigate={navigate}
        openModal={openModal}
        handleDelete={handleDelete}
        handleOpenNotesSection={handleOpenNotesSection}
        handleQuickUpdateStatus={handleQuickUpdateStatus}     
        handleQuickUpdatePriority={handleQuickUpdatePriority} 
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        onRowClick={(task, index) => {
          setSelectedTask(task);
          setSelectedIndex(index);
        }}
        tableContainerRef={tableContainerRef}
        selectedTask={selectedTask}
        onOpenFilter={() => setIsFilterOpen(true)}
        canView={canView}
        canUpdate={canUpdate}
        canDelete={canDelete}
        currentUserId={currentUserId}
      />

      <TaskFilter isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} filters={filters} onFilterChange={handleFilterChange} clearFilters={clearFilters} />
      <TaskFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={fetchCombinedTasks} currentTask={currentTask} />
      
      {isTaskNoteModalOpen && (
        <TaskNoteSection isOpen={isTaskNoteModalOpen} onClose={() => setIsTaskNoteModalOpen(false)} taskId={selectedTaskIdForNote} />
      )}
    </div>
  );
};

export default TaskList;