package com.vti.crm.application.usecases.role;

import com.vti.crm.domain.model.Role;
import com.vti.crm.domain.repository.IPermissionRepository;
import com.vti.crm.domain.repository.IRolePermissionRepository;
import com.vti.crm.domain.repository.IRoleRepository;
import com.vti.crm.interfaces.dto.request.role.RoleUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UpdateRoleUseCase {

    private final IRoleRepository roleRepository;
    private final IRolePermissionRepository rolePermissionRepository;
    private final IPermissionRepository permissionRepository;

    @Transactional
    public Role execute(Integer id, RoleUpdateRequest request) {
        Role existing = roleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy vai trò"));

        // Cập nhật thông tin cơ bản (chỉ khi field != null)
        if (request.getRoleName() != null) existing.setRoleName(request.getRoleName());
        if (request.getCode() != null) existing.setCode(request.getCode());
        if (request.getDescription() != null) existing.setDescription(request.getDescription());
        if (request.getIsActive() != null) existing.setIsActive(request.getIsActive());

        roleRepository.save(existing);

        // Đồng bộ role_permissions nếu FE gửi lên danh sách mới
        if (request.getPermissionIds() != null) {
            List<Integer> requestedIds = request.getPermissionIds();

            // Validate: loại bỏ các ID không tồn tại trong DB
            Set<Integer> validIds = permissionRepository.findAllByIds(requestedIds)
                    .stream()
                    .map(p -> p.getId())
                    .collect(Collectors.toSet());

            // Xóa hết assignments cũ rồi insert lại (delete-then-insert đơn giản, safe với số lượng nhỏ)
            rolePermissionRepository.deleteAllByRoleId(id);

            List<Integer> toSave = requestedIds.stream()
                    .filter(validIds::contains)
                    .distinct()
                    .collect(Collectors.toList());

            if (!toSave.isEmpty()) {
                rolePermissionRepository.saveAll(id, toSave);
            }
        }

        return existing;
    }
}
