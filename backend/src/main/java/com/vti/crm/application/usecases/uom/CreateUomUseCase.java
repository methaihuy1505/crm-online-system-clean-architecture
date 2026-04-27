package com.vti.crm.application.usecases.uom;

import com.vti.crm.domain.model.Uom;
import com.vti.crm.domain.repository.IUomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CreateUomUseCase {
    private final IUomRepository uomRepository;

    @Transactional
    public Uom execute(String code, String name) {
        // Bước 1 & 2: Tạo Entity mới (Entity tự validate trong Constructor)
        Uom uom = new Uom(code, name);
        // Bước 3: Lưu xuống DB
        return uomRepository.save(uom);
    }
}