package com.vti.crm.application.usecases.branch;

import com.vti.crm.domain.repository.IBranchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteBranchUseCase {
    private final IBranchRepository BranchRepository;

    public void execute(Integer id) {
        BranchRepository.deleteById(id);
    }
}