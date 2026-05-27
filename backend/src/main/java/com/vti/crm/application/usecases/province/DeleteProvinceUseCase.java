package com.vti.crm.application.usecases.province;

import com.vti.crm.domain.repository.IProvinceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DeleteProvinceUseCase {
    private final IProvinceRepository provinceRepository;

    public void execute(Integer id) {
        if (provinceRepository.findById(id).isEmpty()) {
            throw new RuntimeException("Không tìm thấy tỉnh thành để xóa");
        }
        provinceRepository.deleteById(id);
    }
}