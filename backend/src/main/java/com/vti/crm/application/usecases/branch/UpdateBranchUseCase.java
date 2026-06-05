package com.vti.crm.application.usecases.branch;

import com.vti.crm.domain.model.Branch;
import com.vti.crm.domain.repository.IBranchRepository;
import com.vti.crm.interfaces.dto.request.branch.BranchRequest;
import com.vti.crm.interfaces.mapper.BranchWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UpdateBranchUseCase {
    private final IBranchRepository branchRepository;
    private final BranchWebMapper webMapper;

    public Branch execute(Integer id, BranchRequest request) {
        branchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chi nhánh để cập nhật"));

        Branch branch = webMapper.toDomain(request);
        branch.setId(id);
        return branchRepository.save(branch);
    }
}