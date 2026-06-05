package com.vti.crm.application.usecases.province;

import com.vti.crm.domain.model.Province;
import com.vti.crm.domain.repository.IProvinceRepository;
import com.vti.crm.interfaces.dto.request.province.ProvinceRequest;
import com.vti.crm.interfaces.mapper.ProvinceWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CreateProvinceUseCase {
    private final IProvinceRepository provinceRepository;
    private final ProvinceWebMapper webMapper;

    public Province execute(ProvinceRequest request) {
        Province province = webMapper.toDomain(request);
        return provinceRepository.save(province);
    }
}