package com.vti.crm.domain.service;

import com.vti.crm.domain.model.LostReason;
import com.vti.crm.domain.repository.ILostReasonRepository;

import java.util.List;

public class LostReasonDomainService {

    private final ILostReasonRepository lostReasonRepository;

    public LostReasonDomainService(ILostReasonRepository lostReasonRepository) {
        this.lostReasonRepository = lostReasonRepository;
    }

    public LostReason create(String code, String name, String description) {
        validateDuplicateCode(code);
        LostReason lostReason = new LostReason(code, name, description);
        return lostReasonRepository.save(lostReason);
    }

    public LostReason findById(Integer id) {
        return lostReasonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lý do thất bại với id: " + id));
    }

    public List<LostReason> findAll() {
        return lostReasonRepository.findAll();
    }

    public LostReason update(Integer id, String name, String description) {
        LostReason lostReason = findById(id);
        lostReason.update(name, description);
        return lostReasonRepository.save(lostReason);
    }

    public void delete(Integer id) {
        LostReason lostReason = findById(id);
        lostReasonRepository.delete(lostReason);
    }

    // ============ PRIVATE — Business Rules ============

    private void validateDuplicateCode(String code) {
        if (lostReasonRepository.existsByCode(code)) {
            throw new IllegalArgumentException("Mã lý do thất bại đã tồn tại");
        }
    }
}