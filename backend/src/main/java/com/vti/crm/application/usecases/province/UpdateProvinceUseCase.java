package com.vti.crm.application.usecases.province;

import com.vti.crm.domain.model.Province;
import com.vti.crm.domain.repository.IProvinceRepository;
import com.vti.crm.interfaces.dto.request.province.ProvinceRequest;
import com.vti.crm.interfaces.mapper.ProvinceWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UpdateProvinceUseCase {
    private final IProvinceRepository provinceRepository;
    private final ProvinceWebMapper webMapper;

    public Province execute(Integer id, ProvinceRequest request) {
        // Kiểm tra tồn tại
        provinceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tỉnh thành để cập nhật"));

        Province updatedProvince = webMapper.toDomain(request);
        updatedProvince.setId(id); // Đảm bảo ID không bị mất khi mapping
        return provinceRepository.save(updatedProvince);
    }
}