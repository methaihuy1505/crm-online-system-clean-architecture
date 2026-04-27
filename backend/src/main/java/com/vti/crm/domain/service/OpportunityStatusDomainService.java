package com.vti.crm.domain.service;

import com.vti.crm.domain.model.OpportunityStatus;
import com.vti.crm.domain.repository.IOpportunityStatusRepository;
import java.util.List;

public class OpportunityStatusDomainService {

    private final IOpportunityStatusRepository repository;

    public OpportunityStatusDomainService(IOpportunityStatusRepository repository) {
        this.repository = repository;
    }

    public OpportunityStatus create(String code, String name, Boolean isFinal) {
        validateDuplicateCode(code);
        OpportunityStatus status = new OpportunityStatus(code, name);
        applyFinalState(status, isFinal);
        return repository.save(status);
    }

    public OpportunityStatus findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy trạng thái cơ hội với id: " + id));
    }

    public List<OpportunityStatus> findAll() {
        return repository.findAll();
    }

    public OpportunityStatus update(Integer id, String name, Boolean isFinal) {
        OpportunityStatus status = findById(id);
        status.update(name);
        applyFinalState(status, isFinal);
        return repository.save(status);
    }

    public void delete(Integer id) {
        OpportunityStatus status = findById(id);
        repository.delete(status);
    }

    // ============ PRIVATE — Business Rules ============

    private void validateDuplicateCode(String code) {
        if (repository.existsByCode(code)) {
            throw new IllegalArgumentException("Mã trạng thái cơ hội đã tồn tại");
        }
    }

    private void applyFinalState(OpportunityStatus status, Boolean isFinal) {
        if (Boolean.TRUE.equals(isFinal)) {
            status.finalized();
        } else {
            status.deFinalized();
        }
    }
}