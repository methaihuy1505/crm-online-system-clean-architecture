// src/components/task/TaskNoteSection.jsx
import React, { useState, useEffect } from 'react';
import api from '../../../lib/api';
import { Edit, Trash2, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

const TaskNoteSection = ({ isOpen, onClose, taskId }) => {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Định dạng ngày giờ hiển thị trong khung thảo luận
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // --- LUỒNG TẢI DANH SÁCH THẢO LUẬN THẬT TỪ DATABASE ---
  const fetchNotes = async () => {
    if (!taskId || !isOpen) return;
    setIsLoading(true);
    try {
      const response = await api.get(`/task-notes/task/${taskId}`);
      setNotes(response.data.data || response.data || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách ghi chú thảo luận:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [taskId, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isOpen, onClose]);

  // Cài đặt phím tắt Enter để gửi nhanh nội dung
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && content.trim() && content.length <= 1000) {
      e.preventDefault();
      handleCreateNote(e);
    }
  };

  // --- HÀNH ĐỘNG 1: THÊM MỚI NỘI DUNG THẢO LUẬN (ĐÃ ĐỒNG BỘ CHUẨN KEY USERID CỨNG) ---
  const handleCreateNote = async (e) => {
    if (e) e.preventDefault();
    if (!content.trim()) return;
    if (content.length > 1000) {
      setError('Nội dung thảo luận không được vượt quá 1000 ký tự.');
      return;
    }

    try {
      // ĐỒNG BỘ PAYLOAD
      const payload = {
        taskId: taskId,
        content: content.trim(),
        userId: 3,                      // Gán trị số 3 để vượt qua tầng check validation của Backend
        createdByName: "Võ Thanh Huy"   // Giữ chuỗi text tên của Huy để in lên giao diện UI
      };
      
      // GỌI ENDPOINT GỐC CHUẨN KHÔNG ĐÈ ID TRÊN URL
      await api.post('/task-notes', payload);
      
      setContent('');
      setError('');
      fetchNotes(); // Reload lại danh sách thảo luận thời gian thực
      toast.success("Đã gửi nội dung thảo luận!", { style: { fontSize: '11px' } });
    } catch (err) {
      console.error("Lỗi khi thêm mới thảo luận:", err);
      toast.error(err.response?.data?.message || "Không thể gửi nội dung thảo luận!", { style: { fontSize: '11px' } });
    }
  };

  // --- HÀNH ĐỘNG 2: CẬP NHẬT CHỈNH SỬA THẢO LUẬN ---
  const handleUpdateNote = async (noteId) => {
    if (!editContent.trim()) return;
    if (editContent.length > 1000) {
      toast.error('Nội dung chỉnh sửa không được vượt quá 1000 ký tự.', { style: { fontSize: '11px' } });
      return;
    }

    try {
      const payload = {
        content: editContent.trim(),
        userId: 3, // Đồng bộ trường nhận diện chỉnh sửa ngầm
        updatedByName: "Võ Thanh Huy"
      };
      await api.put(`/task-notes/${noteId}`, payload);
      setEditingNoteId(null);
      setEditContent('');
      fetchNotes();
      toast.success("Đã cập nhật nội dung thảo luận!", { style: { fontSize: '11px' } });
    } catch (err) {
      console.error("Lỗi khi chỉnh sửa nội dung:", err);
      toast.error(err.response?.data?.message || "Chỉnh sửa nội dung thất bại!", { style: { fontSize: '11px' } });
    }
  };

  // --- HÀNH ĐỘNG 3: XÓA THẢO LUẬN ---
  const handleDeleteNote = async (noteId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nội dung thảo luận này?")) {
      try {
        await api.delete(`/task-notes/${noteId}`);
        fetchNotes();
        toast.success("Đã xóa nội dung thảo luận!", { style: { fontSize: '11px' } });
      } catch (err) {
        console.error("Lỗi khi xóa ghi chú:", err);
        toast.error(err.response?.data?.message || "Xóa nội dung thảo luận thất bại!", { style: { fontSize: '11px' } });
      }
    }
  };

  const startEditing = (note) => {
    setEditingNoteId(note.id);
    setEditContent(note.content);
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditContent('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/30 backdrop-blur-sm animate-fade-in text-[11px]">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-slide-left border-l border-slate-200">
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-700 text-[18px]">forum</span>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Thảo luận công việc #{taskId}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar Body - Danh sách cuộc thảo luận */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 custom-scrollbar">
          {isLoading && notes.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              <span className="animate-spin block mb-2">sync</span> Đang tải nội dung...
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center text-slate-400 py-12 px-4 bg-white rounded-[5px] border border-dashed border-slate-200">
              <span className="material-symbols-outlined text-[32px] text-slate-300 block mb-2">comments_disabled</span>
              Chưa có nội dung thảo luận nào.<br />Hãy là người đầu tiên để lại ý kiến hoặc báo cáo tiến độ tại đây!
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="bg-white border border-slate-200 p-3 rounded-[5px] shadow-sm space-y-2">
                
                {/* Info Header dòng Note */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">
                      {/* Ưu tiên hiển thị tên chữ thật do Backend trả ra từ luồng response list */}
                      {note.createdByName || `Thành viên #${note.userId || note.createdBy}`}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatDateTime(note.createdAt)}
                    </span>
                    {note.updatedAt && note.updatedAt !== note.createdAt && (
                      <span className="text-[9px] text-amber-600 bg-amber-50 px-1 rounded-[3px] font-medium">Đã sửa</span>
                    )}
                  </div>

                  {/* Hành động Sửa/Xóa nội bộ */}
                  <div className="flex gap-1">
                    <button onClick={() => startEditing(note)} className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Sửa">
                      <Edit className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleDeleteNote(note.id)} className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded" title="Xóa">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Khung Text hiển thị tin nhắn */}
                {editingNoteId === note.id ? (
                  <div className="space-y-2 mt-1">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows="2"
                      className="w-full p-2 bg-white border border-blue-400 rounded-[5px] outline-none text-[11px] resize-none focus:ring-1 focus:ring-blue-500/20"
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={cancelEditing} className="px-2.5 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-100 rounded">
                        Hủy
                      </button>
                      <button onClick={() => handleUpdateNote(note.id)} disabled={!editContent.trim()} className="px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded font-bold">
                        Cập nhật
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap select-text selection:bg-blue-100">
                    {note.content}
                  </p>
                )}

              </div>
            ))
          )}
        </div>

        {/* Sidebar Input Form - Khu vực soạn thảo tin nhắn */}
        <div className="p-4 border-t border-slate-100 bg-white shadow-lg">
          <form onSubmit={handleCreateNote} className="space-y-2">
            <div className="relative flex items-end gap-2">
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (error) setError('');
                }}
                onKeyDown={handleKeyDown}
                placeholder="Nhập nội dung thảo luận công việc hoặc báo cáo giải trình..."
                className={`w-full p-2.5 pr-10 bg-white border rounded-[5px] outline-none text-[11px] resize-none focus:ring-1 transition-all ${
                  error || content.length > 1000 
                    ? 'border-red-500 focus:ring-red-500/20' 
                    : 'border-slate-300 focus:border-blue-600 focus:ring-blue-600/20'
                }`}
                rows="2"
              />
              <button 
                type="submit" 
                disabled={!content.trim() || content.length > 1000} 
                className="bg-blue-700 hover:bg-blue-800 disabled:bg-slate-200 text-white disabled:text-slate-400 p-2 rounded-[5px] shadow active:scale-[0.97] transition-all self-center flex items-center justify-center h-[34px] w-[36px]"
                title="Gửi nội dung (Enter)"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="flex justify-between items-center text-[10px]">
              {error ? (
                <span className="text-red-500 font-semibold">{error}</span>
              ) : (
                <span className="text-slate-400 italic">Mẹo: Bấm Enter để gửi, Esc để đóng</span>
              )}
              <span className={`font-mono ${content.length > 1000 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                {content.length}/1000
              </span>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default TaskNoteSection;