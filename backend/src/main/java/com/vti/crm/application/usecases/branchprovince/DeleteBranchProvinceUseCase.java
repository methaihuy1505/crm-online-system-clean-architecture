package com.vti.crm.application.usecases.branchprovince;

import com.vti.crm.domain.repository.IBranchProvinceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteBranchProvinceUseCase {
    private final IBranchProvinceRepository branchProvinceRepository;

    public void execute(Integer id) {
        if (branchProvinceRepository.findById(id).isEmpty()) {
            throw new RuntimeException("Không tìm thấy dữ liệu liên kết để xóa");
        }
        branchProvinceRepository.deleteById(id);
    }
}