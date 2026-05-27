package com.vti.crm.application.usecases.branch;

import com.vti.crm.domain.model.Branch;
import com.vti.crm.domain.repository.IBranchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetBranchByIdUseCase {
    private final IBranchRepository branchRepository;

    public Branch execute(Integer id) {
        return branchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chi nhánh với ID: " + id));
    }
}