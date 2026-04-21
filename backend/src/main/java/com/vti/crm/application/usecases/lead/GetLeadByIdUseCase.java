package com.vti.crm.application.usecases.lead;

import com.vti.crm.domain.model.Lead;
import com.vti.crm.domain.repository.ILeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetLeadByIdUseCase {
    private final ILeadRepository leadRepository;

    public Lead execute(Integer id) {
        return leadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng tiềm năng với ID: " + id));
    }
}