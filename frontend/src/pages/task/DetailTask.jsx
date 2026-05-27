// src/pages/task/DetailTask.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { ArrowLeft } from 'lucide-react';

const DetailTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTaskDetail = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/tasks/${id}`);
        const fetchedTask = response.data;

        const defaultPriority = fetchedTask.priority || "HIGH";
        const defaultStartDate = fetchedTask.startDate || new Date().toISOString().slice(0, 16);
        const defaultEndDate = fetchedTask.endDate || new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 16);
        const defaultStatus = fetchedTask.status || "IN_PROGRESS";

        setTask({
          ...fetchedTask,
          priority: defaultPriority,
          startDate: defaultStartDate,
          endDate: defaultEndDate,
          status: defaultStatus,
        });
      } catch (err) {
        console.error("Lỗi khi tải chi tiết Task:", err);
        setError("Không thể tải thông tin chi tiết của công việc này.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchTaskDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-[#F9FAFB] text-[11px] text-slate-500">
        <span className="material-symbols-outlined animate-spin mr-2">sync</span> Đang tải chi tiết công việc...
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="p-6 min-h-screen bg-[#F9FAFB] text-[11px] text-center">
        <p className="text-red-500 font-semibold mb-4">{error || "Công việc không tồn tại."}</p>
        <button onClick={() => navigate('/tasks')} className="inline-flex items-center gap-1 text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </button>
      </div>
    );
  }

  const renderFieldValue = (label, value, isDate = false, isRelate = false) => {
    let displayValue = value;
    if (isDate && value) {
      displayValue = new Date(value).toLocaleString();
    }
    return (
      <div className="flex border-b border-slate-100 py-3 text-[11px] items-center">
        <span className="w-32 font-bold text-slate-500 uppercase tracking-tight">{label}:</span>
        {isRelate && value ? (
          <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-[5px] font-medium">
            {value}
          </span>
        ) : (
          <span className="text-slate-800 font-semibold">{displayValue || "-"}</span>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 bg-[#F9FAFB] min-h-screen text-[11px]">
      <div className="max-w-4xl mx-auto space-y-4">
        
        <button 
          onClick={() => navigate('/tasks')} 
          className="flex items-center gap-1 text-slate-600 hover:text-blue-800 font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> QUAY LẠI DANH SÁCH
        </button>

        <div className="bg-white border border-slate-200 rounded-[5px] p-4 shadow-sm flex justify-between items-center">
          <div>
            <span className="bg-blue-100 text-blue-800 font-mono px-2 py-0.5 rounded text-[10px]">TASK #{task.id}</span>
            <h2 className="text-lg font-bold text-slate-800 mt-1">{task.title}</h2>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[5px] p-6 shadow-sm space-y-1">
          {renderFieldValue('Mức độ ưu tiên', task.priority)}
          {renderFieldValue('Trạng thái', task.status)}
          {renderFieldValue('Ngày bắt đầu', task.startDate, true)}
          {renderFieldValue('Ngày kết thúc', task.endDate, true)}
          {renderFieldValue('Số lần gia hạn', task.extensionCount)}
          {renderFieldValue('Quá hạn', task.isOverdue ? 'Có' : 'Không')}
          {renderFieldValue('Người giao việc', task.createdByName)}
          {renderFieldValue('Người phụ trách', task.assignedToName)}
          {renderFieldValue('Liên kết', task.relateName, false, true)}
          {renderFieldValue('Ngày tạo', task.createdAt, true)}
          {renderFieldValue('Ngày cập nhật', task.updatedAt, true)}
        </div>

        <div className="border-t border-slate-200 pt-6 mt-6">
          <span className="text-[10px] font-bold text-slate-500 uppercase mb-2 block whitespace-nowrap">Mô tả chi tiết</span>
          <div className="bg-slate-50 border border-slate-200 rounded-[5px] p-4 text-[11px] text-slate-700 min-h-[120px] whitespace-pre-wrap">
            {task.description || "Không có mô tả chi tiết cho công việc này."}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DetailTask;