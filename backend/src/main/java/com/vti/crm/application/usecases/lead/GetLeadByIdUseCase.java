package com.vti.crm.application.usecases.lead;

import com.vti.crm.domain.model.Lead;
import com.vti.crm.domain.repository.ILeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetLeadByIdUseCase {
    private final ILeadRepository leadRepository;

    public Lead execute(Integer id, Integer currentUserId, Integer roleId) { // Bổ sung 2 biến bảo mật
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng tiềm năng với ID: " + id));

        if (roleId != null && roleId != 1 && !currentUserId.equals(lead.getAssignedTo())) {
            throw new SecurityException("Bạn không có quyền xem thông tin khách hàng tiềm năng của nhân viên khác!");
        }

        return lead;
    }
}