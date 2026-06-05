package com.vti.crm.application.usecases.lead;

import com.vti.crm.domain.model.Lead;
import com.vti.crm.domain.repository.ILeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeleteLeadUseCase {
    private final ILeadRepository leadRepository;

    @Transactional
    public void execute(Integer id, Integer updatedBy) {
        Lead existingLead = leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Lead với ID: " + id));

        // Gọi hành vi nghiệp vụ xóa mềm và truyền ID người xóa
        existingLead.softDelete(updatedBy);

        // Lưu lại xuống database
        leadRepository.save(existingLead);
    }
}