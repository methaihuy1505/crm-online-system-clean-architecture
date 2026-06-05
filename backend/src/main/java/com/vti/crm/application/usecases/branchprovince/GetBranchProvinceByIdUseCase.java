package com.vti.crm.application.usecases.branchprovince;

import com.vti.crm.domain.model.BranchProvince;
import com.vti.crm.domain.repository.IBranchProvinceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetBranchProvinceByIdUseCase {
    private final IBranchProvinceRepository branchProvinceRepository;

    public BranchProvince execute(Integer id) {
        return branchProvinceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu liên kết chi nhánh-tỉnh với ID: " + id));
    }
}