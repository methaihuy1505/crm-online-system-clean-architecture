package com.vti.crm.application.usecases.role;

import com.vti.crm.domain.repository.IRolePermissionRepository;
import com.vti.crm.domain.repository.IRoleRepository;
import com.vti.crm.domain.repository.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeleteRoleUseCase {

    private final IRoleRepository roleRepository;
    private final IRolePermissionRepository rolePermissionRepository;

     private final IUserRepository userRepository;

    @Transactional
    public void execute(Integer id) {

         if (userRepository.existsByRoleId(id)) {
             throw new IllegalStateException("Không thể xóa! Vai trò đang được sử dụng bởi người dùng.");
         }

        // 2. FIX LỖI FOREIGN KEY: Xóa toàn bộ dữ liệu trong bảng trung gian (role_permissions) trước
        rolePermissionRepository.deleteAllByRoleId(id);

        // 3. Sau khi bảng con đã sạch, tiến hành xóa Role ở bảng cha
        roleRepository.deleteById(id);
    }
}