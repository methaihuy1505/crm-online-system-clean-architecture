import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { Edit, Trash2, Send, X, Plus } from 'lucide-react';

const TaskNoteSection = ({ isOpen, onClose, taskId }) => {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotes = async () => {
    if (!taskId || !isOpen) return;
    setIsLoading(true);
    try {
      const response = await api.get(`/task-notes/task/${taskId}`);
      // Lấy dữ liệu mảng, nếu response.data là array thì lấy luôn, nếu là object bọc thì lấy .data
      const notesData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setNotes(notesData);
    } catch (error) {
      console.error("Lỗi khi tải ghi chú:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [taskId, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Nội dung không được để trống");
      return;
    }
    if (content.length > 1000) {
      setError("Nội dung thảo luận không được vượt quá 1000 ký tự");
      return;
    }

    setError('');

    try {
      await api.post("/task-notes", {
        taskId: parseInt(taskId),
        userId: 1, // Dùng mock data thay vì hardcode 1
        content: content
      });
      setContent('');
      fetchNotes();
    } catch (error) {
      alert("Lỗi khi thêm ghi chú: " + (error.response?.data?.message || ""));
    }
  };

  const handleDelete = async (noteId) => {
    if (window.confirm("Xóa ghi chú này?")) {
      try {
        await api.delete(`/task-notes/${noteId}`);
        fetchNotes();
      } catch (error) { alert("Lỗi khi xóa"); }
    }
  };

  const handleUpdate = async (noteId) => {
    if (!editContent.trim()) {
      alert("Nội dung không được để trống");
      return;
    }
    if (editContent.length > 1000) {
      alert("Nội dung thảo luận không được vượt quá 1000 ký tự");
      return;
    }

    try {
      await api.put(`/task-notes/${noteId}`, {
        content: editContent
      });
      setEditingNoteId(null);
      fetchNotes();
    } catch (error) { alert("Lỗi khi sửa!!!"); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-[5px] shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center rounded-t-[5px]">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">forum</span>
            Thảo luận công việc #{taskId}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-[5px] transition-colors" title="Đóng (Ctrl + H)">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Danh sách ghi chú */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar text-[11px]">
          {isLoading ? (
             <div className="text-center py-10 text-slate-500 flex flex-col items-center">
               <span className="material-symbols-outlined animate-spin text-3xl mb-2">sync</span>
               Đang tải dữ liệu...
             </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-10">
              <span className="material-symbols-outlined text-slate-300 text-5xl mb-2">chat_bubble</span>
              <p className="text-slate-400 italic text-[11px]">Chưa có trao đổi nào cho công việc này.</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="bg-white border border-slate-200 rounded-[5px] p-4 shadow-sm group hover:border-blue-200 transition-colors">
                <div className="flex justify-between items-start mb-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center text-[10px] font-bold">
                      U{note.userId}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-700">Người dùng #{note.userId}</p>
                      <p className="text-[10px] text-slate-400">{new Date(note.createdAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</p>
                    </div>
                  </div>
                  {/* Nút hành động */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingNoteId(note.id); setEditContent(note.content); }} className="p-1 text-blue-600 hover:bg-blue-50 rounded-[5px]" title="Sửa">
                       <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(note.id)} className="p-1 text-red-500 hover:bg-red-50 rounded-[5px]" title="Xóa">
                       <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {editingNoteId === note.id ? (
                  <div className="space-y-2 mt-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className={`w-full p-2 text-[11px] border rounded-[5px] outline-none transition-all ${editContent.length > 1000 ? 'border-red-500 bg-red-50' : 'border-blue-300 focus:ring-1 focus:ring-blue-500'}`}
                      rows="2"
                    />
                    <div className="flex justify-between items-center text-[10px] font-bold mt-1">
                      <span className={`${editContent.length > 1000 ? 'text-red-500' : 'text-slate-400'}`}>
                        {editContent.length}/1000
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingNoteId(null)} className="px-3 py-1 text-slate-500 hover:bg-slate-100 rounded-[5px] transition-colors">HỦY</button>
                        <button onClick={() => handleUpdate(note.id)} className="px-3 py-1 bg-blue-600 text-white rounded-[5px] hover:bg-blue-700 transition-colors shadow-sm">CẬP NHẬT</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-wrap mt-2">{note.content}</p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Input thêm mới */}
        <form onSubmit={handleSend} className="p-4 border-t bg-slate-50 rounded-b-[5px] space-y-2">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
               <label className="text-[11px] font-bold text-slate-600 uppercase">Thêm thảo luận mới</label>
               <span className={`text-[10px] font-semibold ${content.length > 1000 ? 'text-red-500' : 'text-slate-400'}`}>
                 {content.length}/1000
               </span>
            </div>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (error) setError('');
              }}
              placeholder="Nhập nội dung thảo luận hoặc giải trình..."
              className={`w-full p-3 bg-white border rounded-[5px] outline-none focus:ring-1 transition-all text-[11px] resize-none ${error || content.length > 1000 ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'}`}
              rows="3"
            />
            {error && <p className="text-red-500 text-[11px] font-semibold">{error}</p>}
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={!content.trim() || content.length > 1000} className="bg-blue-700 text-white px-5 py-2 rounded-[5px] font-bold text-[11px] flex items-center gap-2 shadow-md hover:bg-blue-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all">
              <Send className="w-3.5 h-3.5" /> Gửi thảo luận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskNoteSection;