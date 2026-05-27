package com.vti.crm.application.usecases.province;

import com.vti.crm.domain.model.Province;
import com.vti.crm.domain.repository.IProvinceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetProvinceByIdUseCase {
    private final IProvinceRepository provinceRepository;

    public Province execute(Integer id) {
        return provinceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tỉnh thành với ID: " + id));
    }
}