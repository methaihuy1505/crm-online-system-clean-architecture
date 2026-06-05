import axios from "axios";
import toast from "react-hot-toast"; 

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1", 
  timeout: 10000, 
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      
      // Lấy câu thông báo xịn xò từ GlobalExceptionHandler của Backend
      const backendMessage = error.response.data?.message;

      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_role");
        localStorage.removeItem("userPermissions");
        
        if (window.location.pathname !== "/login") {
          toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
          setTimeout(() => {
            window.location.href = "/login"; 
          }, 1000);
        }
      } 
      else if (status === 403) {
        // Nếu backend có gửi thông báo thì dùng, không thì dùng câu mặc định
        toast.error(backendMessage || "Bạn không có quyền thực hiện thao tác này!");
      }
      else if (status === 500) {
        toast.error(backendMessage || "Lỗi máy chủ nội bộ. Vui lòng thử lại sau!");
      }
      
      
    } else {
      // Bắt các lỗi do sập Server Backend hoặc rớt mạng
      toast.error("Không thể kết nối đến máy chủ! Vui lòng kiểm tra kết nối mạng.");
    }
    
    return Promise.reject(error);
  }
);

export default api;