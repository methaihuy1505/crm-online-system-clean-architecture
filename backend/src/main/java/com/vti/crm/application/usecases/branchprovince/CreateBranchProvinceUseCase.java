package com.vti.crm.application.usecases.branchprovince;

import com.vti.crm.domain.model.BranchProvince;
import com.vti.crm.domain.repository.IBranchProvinceRepository;
import com.vti.crm.interfaces.dto.request.branchprovince.BranchProvinceRequest;
import com.vti.crm.interfaces.mapper.BranchProvinceWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateBranchProvinceUseCase {
    private final IBranchProvinceRepository branchProvinceRepository;
    private final BranchProvinceWebMapper webMapper;

    public BranchProvince execute(BranchProvinceRequest request) {
        BranchProvince bp = webMapper.toDomain(request);
        return branchProvinceRepository.save(bp);
    }
}