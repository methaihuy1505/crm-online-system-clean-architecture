import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/api'; 
import { ArrowLeft } from 'lucide-react';

export default function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchActivity = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/activities/${id}`);
      const activityData = response.data;
      setActivity(activityData);
    } catch (err) {
      setError(err.message || 'Failed to fetch activity');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivity();
  }, [id]);

  if (isLoading) {
    return (
        <div className="p-6 flex items-center justify-center min-h-screen bg-[#F9FAFB] text-[11px]">
          <span className="material-symbols-outlined animate-spin text-gray-400 text-[40px]">sync</span>
          <span className="ml-3 text-slate-500">Đang tải dữ liệu thực tế...</span>
        </div>
    );
  }

  if (error || !activity) {
    return (
        <div className="p-6 text-red-500 text-center min-h-screen bg-[#F9FAFB] text-[11px]">
          {error || 'Không tìm thấy nhật ký hoạt động này!'}
          <button onClick={() => navigate('/activities')} className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-[5px] text-[11px]">Quay lại danh sách</button>
        </div>
      );
  }

  const renderFieldValue = (label, value, isDate = false, isHighlight = false) => {
    let displayValue = value;
    if (isDate) {
      displayValue = value ? new Date(value).toLocaleString("vi-VN", { dateStyle: 'medium', timeStyle: 'short' }) : '-';
    } else if (value === null || value === undefined || value === '') {
      displayValue = '-';
    }

    return (
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-500 uppercase whitespace-nowrap">{label}</span>
        {isHighlight && value && value !== '-' ? (
          <span className="inline-block text-[11px] bg-blue-50 text-blue-700 border border-blue-100 font-semibold mt-1 px-2.5 py-1 rounded-[5px] w-fit">
            {displayValue}
          </span>
        ) : (
          <span className="text-[11px] text-slate-800 font-semibold mt-1">{displayValue}</span>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 bg-[#F9FAFB] min-h-screen flex flex-col text-[11px]">
      <div className="flex justify-between items-center mb-6 max-w-5xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-slate-800">Chi tiết Hoạt động #{activity.id}</h1>
        <button onClick={() => navigate('/activities')} className="px-4 py-2 bg-blue-600 text-white rounded-[5px] text-[11px] flex items-center gap-2 shadow-sm transition-all hover:bg-blue-700">
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </button>
      </div>

      <div className="bg-white rounded-[5px] shadow-sm border border-slate-200 p-6 md:p-8 flex-1 max-w-5xl mx-auto w-full">

        <div className="flex flex-col md:flex-row md:justify-between md:items-start border-b border-slate-100 pb-5 mb-6 gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">{activity.subject}</h2>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
              <span className="bg-slate-100 px-2 py-0.5 rounded-[5px] font-medium font-mono">#{activity.id}</span>
              <span>•</span>
              <span className="font-bold text-blue-600">{activity.activityType}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {activity.isPriority && (
              <span className="px-3 py-1 text-[11px] font-bold text-red-700 bg-red-50 border border-red-100 rounded-[5px] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">star</span> Quan trọng
              </span>
            )}
            {activity.isCompleted ? (
              <span className="px-3 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-[5px] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span> Đã hoàn thành
              </span>
            ) : (
              <span className="px-3 py-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded-[5px] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">pending</span> Đang chờ xử lý
              </span>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span> Thông tin chung
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 bg-slate-50 p-5 rounded-[5px] border border-slate-100">
            {renderFieldValue('Đối tượng liên quan', activity.parentName, false, true)}
            {renderFieldValue('Thuộc công việc', activity.taskTitle)}
            {renderFieldValue('Người liên hệ', activity.contactName)}
            {renderFieldValue('Người tạo nhật ký', activity.createdByName)}
            
            {renderFieldValue('Ngày tạo', activity.createdAt, true)}
            {renderFieldValue('Mã số người cập nhật', activity.updatedBy ? `Nhân viên #${activity.updatedBy}` : '-')}
            {renderFieldValue('Lần cập nhật cuối', activity.updatedAt, true)}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-4 bg-indigo-500 rounded-full"></span> Chi tiết tác vụ chuyên biệt
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">

            {activity.activityType === 'CALL' && (
              <>
                {renderFieldValue('Ngày thực hiện gọi', activity.activityDate, true)}
                {renderFieldValue('Hướng cuộc gọi', activity.callType === 'INBOUND' ? '📞 Gọi đến (Inbound)' : '📲 Gọi đi (Outbound)')}
                {renderFieldValue('Kết quả cuộc gọi', activity.callResult)}
                {renderFieldValue('Thời lượng đàm thoại', activity.duration ? `${activity.duration} phút` : '0 phút')}
                {renderFieldValue('Kế hoạch hẹn gọi lại', activity.nextFollowUpDate, true)}
              </>
            )}

            {activity.activityType === 'MEETING' && (
              <>
                {renderFieldValue('Địa điểm diễn ra', activity.location)}
                {renderFieldValue('Thời gian bắt đầu', activity.startDate, true)}
                {renderFieldValue('Thời gian kết thúc', activity.endDate, true)}
              </>
            )}

            {activity.activityType === 'NOTE' && (
                renderFieldValue('Ngày ghi nhật ký', activity.activityDate, true)
            )}

            {(activity.activityType === 'EMAIL_QUOTE' || activity.activityType === 'EMAIL_TRANSACTION') && (
                renderFieldValue('Ngày gửi thư điện tử', activity.activityDate, true)
            )}

          </div>
        </div>

        {(activity.description || activity.activityType === 'NOTE') && (
          <div>
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-slate-400 rounded-full"></span> Chi tiết nội dung trao đổi
            </h3>
            <div className="bg-slate-50 border border-slate-200 rounded-[5px] p-5 text-[11px] text-slate-700 leading-relaxed whitespace-pre-wrap min-h-[120px] select-text selection:bg-blue-100">
              {activity.description || <span className="text-slate-400 italic">Không có nội dung mô tả đính kèm.</span>}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}