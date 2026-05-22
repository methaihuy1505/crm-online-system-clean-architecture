package com.vti.crm.domain.service;

import com.vti.crm.domain.model.Uom;
import com.vti.crm.domain.repository.IUomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UomDomainService {

    private final IUomRepository uomRepository; // Dùng Interface

    public Uom create(Uom uom) {
        validateForCreate(uom);
        if (uomRepository.existsByCode(uom.getCode())) {
            throw new RuntimeException("UOM code already exists");
        }
        return uomRepository.save(uom);
    }

    public Uom update(Integer id, String code, String name, boolean status) {
        Uom existing = getById(id);

        // Kiểm tra logic nghiệp vụ trước khi update
        if (code != null && !existing.getCode().equals(code) && uomRepository.existsByCode(code)) {
            throw new RuntimeException("UOM code already exists");
        }

        // Gọi Entity tự cập nhật
        existing.update(code, name, status);
        return uomRepository.save(existing);
    }

    public void delete(Integer id) {
        Uom uom = getById(id);
        uomRepository.delete(uom);
    }

    @Transactional(readOnly = true)
    public Uom getById(Integer id) {
        return uomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UOM not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Uom> getAll() {
        return uomRepository.findAll();
    }

    // --- Private Methods giữ nguyên logic nghiệp vụ ---
    private void validateForCreate(Uom uom) {
        if (uom.getCode() == null || uom.getCode().trim().isEmpty()) throw new RuntimeException("UOM code must not be empty");
        if (uom.getName() == null || uom.getName().trim().isEmpty()) throw new RuntimeException("UOM name must not be empty");
        if (uomRepository.existsByCode(uom.getCode())) throw new RuntimeException("UOM code already exists");
    }

    private void validateForUpdate(Integer id, Uom uom) {
        if (uom.getCode() != null) {
            uomRepository.findByCode(uom.getCode()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) throw new RuntimeException("UOM code already exists");
            });
        }
    }

}