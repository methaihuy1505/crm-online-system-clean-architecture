package com.vti.crm.application.usecases.branchprovince;

import com.vti.crm.domain.model.BranchProvince;
import com.vti.crm.domain.repository.IBranchProvinceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetAllBranchProvincesUseCase {
    private final IBranchProvinceRepository branchProvinceRepository;
    public List<BranchProvince> execute() {
        return branchProvinceRepository.findAll();
    }
}
