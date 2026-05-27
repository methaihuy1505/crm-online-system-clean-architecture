import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import toast, { Toaster } from "react-hot-toast";

import TaskListHeader from "./components/TaskListHeader";
import { TaskTable } from "./components/tables/TaskTable";
import TaskFormModal from "./components/TaskFormModal";
import TaskNoteSection from "./components/TaskNoteSection";
import TaskFilter from "./components/TaskFilter";

const TaskList = () => {
  const navigate = useNavigate();
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

  // Chuyển currentPage thành base 1 cho đồng bộ UI
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  
  const [isTaskNoteModalOpen, setIsTaskNoteModalOpen] = useState(false);
  const [selectedTaskIdForNote, setSelectedTaskIdForNote] = useState(null);

  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const tableContainerRef = useRef(null);

  useEffect(() => {
    setSelectedIndex(-1);
    setSelectedTask(null);
  }, [tasks]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const activeFilters = {};
      if (filters.status.length > 0) activeFilters.status = filters.status.join(",");
      if (filters.priority.length > 0) activeFilters.priority = filters.priority.join(",");
      if (filters.relateType.length > 0) activeFilters.relateType = filters.relateType.join(",");
      if (filters.isOverdue.length > 0) activeFilters.isOverdue = filters.isOverdue.join(",");
      if (keyword.trim()) activeFilters.keyword = keyword.trim();

      const response = await api.get("/tasks", {
        params: {
          page: currentPage - 1, // Gửi lên BE base 0
          size: pageSize,
          ...activeFilters,
        },
      });

      const responseData = response.data.data || response.data.content || response.data;
      setTasks(Array.isArray(responseData) ? responseData : []);
      
      const pageInfo = response.data.page || response.data;
      setTotalPages(pageInfo.totalPages || 1);
      setTotalElements(pageInfo.totalElements || 0);
    } catch (error) {
      toast.error("Không thể tải danh sách công việc.");
      console.error("Lỗi khi tải danh sách công việc:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTasks();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [currentPage, pageSize, filters, keyword]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ status: [], priority: [], relateType: [], isOverdue: [] });
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
        fetchTasks();
      } catch (error) {
        toast.error("Lỗi khi xóa công việc!");
        console.error("Lỗi khi xóa công việc:", error);
      }
    }
  };

  const handleOpenNotesSection = (taskId) => {
    setSelectedTaskIdForNote(taskId);
    setIsTaskNoteModalOpen(true);
  };

  // Bắt phím tắt & Mũi tên
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
      if (isModalOpen || isTaskNoteModalOpen || isFilterOpen) return;

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

      if (e.altKey) {
        if (e.code === "KeyN" || e.key.toLowerCase() === "n") {
          e.preventDefault();
          openModal(null);
        }
        if (e.code === "KeyE" || e.key.toLowerCase() === "e") {
          e.preventDefault();
          if (selectedTask) openModal(selectedTask);
        }
        if (e.code === "KeyD" || e.key.toLowerCase() === "d") {
          e.preventDefault();
          if (selectedTask) handleDelete(selectedTask.id);
        }
        if (e.code === "KeyV" || e.key.toLowerCase() === "v") {
          e.preventDefault();
          if (selectedTask) navigate(`/tasks/${selectedTask.id}`);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tasks, selectedTask, isModalOpen, isTaskNoteModalOpen, isFilterOpen]);

  // Auto Scroll
  useEffect(() => {
    if (selectedIndex === -1 || !tableContainerRef.current) return;
    const activeRow = tableContainerRef.current.querySelector(`tr[data-index="${selectedIndex}"]`);
    if (activeRow) {
      const container = tableContainerRef.current;
      const rowTop = activeRow.offsetTop;
      const rowBottom = rowTop + activeRow.offsetHeight;
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;

      if (rowTop < containerTop) container.scrollTo({ top: rowTop, behavior: "smooth" });
      else if (rowBottom > containerBottom) container.scrollTo({ top: rowBottom - container.clientHeight, behavior: "smooth" });
    }
  }, [selectedIndex]);

  const activeFiltersCount = Object.values(filters).reduce((acc, curr) => acc + curr.length, 0);

  return (
    // Layout khóa chiều cao y hệt trang Lead/Customer
    <div className="flex flex-col h-[calc(100vh-2rem)] space-y-4 relative overflow-hidden">
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { borderRadius: "12px", background: "#1e293b", color: "#fff", fontSize: "14px", fontWeight: "bold" } }} />
      
      <div className="shrink-0">
        <TaskListHeader
          openModal={() => openModal(null)}
          keyword={keyword}
          setKeyword={setKeyword}
          onOpenFilter={() => setIsFilterOpen(true)}
          activeFiltersCount={activeFiltersCount}
        />
      </div>

      <TaskTable
        tasks={tasks}
        isLoading={isLoading}
        navigate={navigate}
        openModal={openModal}
        handleDelete={handleDelete}
        handleOpenNotesSection={handleOpenNotesSection}
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
      />

      <TaskFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        clearFilters={clearFilters}
      />

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchTasks}
        currentTask={currentTask}
      />

      {isTaskNoteModalOpen && (
        <TaskNoteSection
          isOpen={isTaskNoteModalOpen}
          onClose={() => setIsTaskNoteModalOpen(false)}
          taskId={selectedTaskIdForNote}
        />
      )}
    </div>
  );
};

export default TaskList;