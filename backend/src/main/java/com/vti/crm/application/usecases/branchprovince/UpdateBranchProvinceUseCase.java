package com.vti.crm.application.usecases.branchprovince;

import com.vti.crm.domain.model.BranchProvince;
import com.vti.crm.domain.repository.IBranchProvinceRepository;
import com.vti.crm.interfaces.dto.request.branchprovince.BranchProvinceRequest;
import com.vti.crm.interfaces.mapper.BranchProvinceWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UpdateBranchProvinceUseCase {
    private final IBranchProvinceRepository branchProvinceRepository;
    private final BranchProvinceWebMapper webMapper;

    public BranchProvince execute(Integer id, BranchProvinceRequest request) {
        branchProvinceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu liên kết để cập nhật"));

        BranchProvince bp = webMapper.toDomain(request);
        bp.setId(id);
        return branchProvinceRepository.save(bp);
    }
}