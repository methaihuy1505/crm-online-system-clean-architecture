package com.vti.crm.domain.service;

import com.vti.crm.domain.model.OpportunityStage;
import com.vti.crm.domain.repository.IOpportunityStageRepository;
import java.util.List;

public class OpportunityStageDomainService {

    private final IOpportunityStageRepository repository;

    public OpportunityStageDomainService(IOpportunityStageRepository repository) {
        this.repository = repository;
    }

    public OpportunityStage create(String name, Integer probabilityDefault,
                                   Integer sortOrder, Boolean isClosed) {
        OpportunityStage stage = new OpportunityStage(name, probabilityDefault, sortOrder);
        applyClosedState(stage, isClosed);
        return repository.save(stage);
    }

    public OpportunityStage findById(Integer id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy giai đoạn cơ hội với id: " + id));
    }

    public List<OpportunityStage> findAll() {
        return repository.findAll();
    }

    public OpportunityStage update(Integer id, String name, Integer probabilityDefault,
                                   Integer sortOrder, Boolean isClosed) {
        OpportunityStage stage = findById(id);
        stage.update(name, probabilityDefault, sortOrder);
        applyClosedState(stage, isClosed);
        return repository.save(stage);
    }

    public void delete(Integer id) {
        OpportunityStage stage = findById(id);
        repository.delete(stage);
    }

    // ============ PRIVATE — Business Rules ============

    private void applyClosedState(OpportunityStage stage, Boolean isClosed) {
        if (Boolean.TRUE.equals(isClosed)) {
            stage.closed();
        } else {
            stage.open();
        }
    }
}