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

        // Set default values if not present (mock/hardcode frontend)
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
        setError("Không tìm thấy công việc hoặc có lỗi xảy ra.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaskDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-[#F9FAFB] text-[11px]">
        <span className="material-symbols-outlined animate-spin text-gray-400 text-[40px]">sync</span>
        <span className="ml-3 text-slate-500">Đang tải chi tiết công việc...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 text-center min-h-screen bg-[#F9FAFB] text-[11px]">
        {error}
        <button onClick={() => navigate('/task')} className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-[5px] text-[11px]">Quay lại danh sách</button>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-6 text-slate-500 text-center min-h-screen bg-[#F9FAFB] text-[11px]">
        Không tìm thấy thông tin công việc.
        <button onClick={() => navigate('/task')} className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-[5px] text-[11px]">Quay lại danh sách</button>
      </div>
    );
  }

  const renderFieldValue = (label, value, isDate = false, isRelated = false) => {
    let displayValue = value;
    if (isDate) {
      displayValue = value ? new Date(value).toLocaleString("vi-VN", { dateStyle: 'medium', timeStyle: 'short' }) : '-';
    } else if (isRelated) {
      displayValue = task.relateType && task.relateId ? `${task.relateType} #${task.relateId}` : '-';
    } else if (value === null || value === undefined || value === '') {
      displayValue = '-';
    }

    return (
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-500 uppercase">{label}</span>
        <span className="text-[11px] text-slate-800 font-medium mt-0.5">{displayValue}</span>
      </div>
    );
  };

  return (
    <div className="p-6 bg-[#F9FAFB] min-h-screen flex flex-col text-[11px]">
      <div className="flex justify-between items-center mb-6 max-w-5xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-slate-800">Chi tiết Công việc #{task.id}</h1>
        <button onClick={() => navigate('/task')} className="px-4 py-2 bg-blue-600 text-white rounded-[5px] text-[11px] flex items-center gap-2 shadow-sm transition-all hover:bg-blue-700">
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </button>
      </div>

      <div className="bg-white rounded-[5px] shadow-sm border border-slate-200 p-6 space-y-6 flex-1 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {renderFieldValue('ID', task.id)}
          {renderFieldValue('Tiêu đề', task.title)}
          {renderFieldValue('Mức độ ưu tiên', task.priority || "HIGH")}
          {renderFieldValue('Trạng thái', task.status || "IN_PROGRESS")}
          {renderFieldValue('Ngày bắt đầu', task.startDate || new Date().toISOString().slice(0, 16), true)}
          {renderFieldValue('Ngày kết thúc', task.endDate || new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 16), true)}
          {renderFieldValue('Số lần gia hạn', task.extensionCount)}
          {renderFieldValue('Quá hạn', task.isOverdue ? 'Có' : 'Không')}
          {renderFieldValue('Người giao việc', task.createdBy ? `User #${task.createdBy}` : '-')}
          {renderFieldValue('Người phụ trách', task.assignedTo ? `User #${task.assignedTo}` : '-')}
          {renderFieldValue('Liên kết', `${task.relateType || '-'}`, false, true)}
          {renderFieldValue('Ngày tạo', task.createdAt, true)}
          {renderFieldValue('Ngày cập nhật', task.updatedAt, true)}
        </div>

        <div className="border-t border-slate-200 pt-6 mt-6">
          <span className="text-[10px] font-bold text-slate-500 uppercase mb-2 block whitespace-nowrap">Mô tả chi tiết</span>
          <div className="bg-slate-50 border border-slate-200 rounded-[5px] p-4 text-[11px] text-slate-700 min-h-[120px] whitespace-pre-wrap">
            {task.description || <span className="italic text-slate-400">Không có mô tả chi tiết...</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTask;