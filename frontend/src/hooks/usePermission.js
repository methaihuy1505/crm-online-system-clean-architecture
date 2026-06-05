export const usePermission = () => {
  // Lấy danh sách quyền từ localStorage
  const storedPermissions = localStorage.getItem("userPermissions");
  const userPermissions = storedPermissions ? JSON.parse(storedPermissions) : [];

  // Hàm kiểm tra quyền
  const hasPermission = (permissionCode) => {
    return userPermissions.includes(permissionCode);
  };

  return { hasPermission };
};