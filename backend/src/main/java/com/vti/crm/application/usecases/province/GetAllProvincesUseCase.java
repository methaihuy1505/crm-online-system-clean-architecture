package com.vti.crm.application.usecases.province;

import com.vti.crm.domain.model.Province;
import com.vti.crm.domain.repository.IProvinceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class GetAllProvincesUseCase {
    private final IProvinceRepository provinceRepository;
    public List<Province> execute() {
        return provinceRepository.findAll();
    }
}
