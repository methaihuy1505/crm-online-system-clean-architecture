package com.vti.crm.application.usecases.branch;

import com.vti.crm.domain.model.Branch;
import com.vti.crm.domain.repository.IBranchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service @RequiredArgsConstructor
public class GetAllBranchesUseCase {
    private final IBranchRepository branchRepository;

    public List<Branch> execute() {
        return branchRepository.findAll();
    }
}