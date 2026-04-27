package com.vti.crm.domain.service;

import com.vti.crm.domain.model.Opportunity;
import com.vti.crm.domain.repository.IOpportunityRepository;
import com.vti.crm.domain.repository.IOpportunityStageRepository;
import com.vti.crm.domain.repository.IOpportunityStatusRepository;
import com.vti.crm.domain.repository.ILostReasonRepository;

import java.util.List;

public class OpportunityDomainService {

    private final IOpportunityRepository opportunityRepository;
    private final IOpportunityStageRepository stageRepository;
    private final IOpportunityStatusRepository statusRepository;
    private final ILostReasonRepository lostReasonRepository;

    public OpportunityDomainService(IOpportunityRepository opportunityRepository,
                                    IOpportunityStageRepository stageRepository,
                                    IOpportunityStatusRepository statusRepository,
                                    ILostReasonRepository lostReasonRepository) {
        this.opportunityRepository = opportunityRepository;
        this.stageRepository       = stageRepository;
        this.statusRepository      = statusRepository;
        this.lostReasonRepository  = lostReasonRepository;
    }

    public Opportunity create(String opportunityCode, String name, Integer customerId,
                              Integer stageId, Integer statusId, Integer lostReasonId,
                              Double depositAmount, Integer probability, String description) {
        validateDuplicateCode(opportunityCode);
        validateStageExists(stageId);
        validateStatusExists(statusId);
        validateLostReasonExists(lostReasonId);

        Opportunity opportunity = new Opportunity.OpportunityBuilder()
                .opportunityCode(opportunityCode)
                .name(name)
                .customerId(customerId)
                .stage(stageId)
                .status(statusId)
                .lostReason(lostReasonId)
                .totalAmount(0.0)
                .depositAmount(depositAmount)
                .probability(probability)
                .description(description)
                .build();

        opportunity.recalculateTotal();
        opportunity.calculateRemaining();
        return opportunityRepository.save(opportunity);
    }

    public Opportunity findById(Integer id) {
        return opportunityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy cơ hội với id: " + id));
    }

    public List<Opportunity> findAll() {
        return opportunityRepository.findAll();
    }

    public Opportunity update(Integer id, String name, Integer customerId,
                              Integer stageId, Integer statusId, Integer lostReasonId,
                              Double depositAmount, Integer probability, String description) {
        validateStageExists(stageId);
        validateStatusExists(statusId);
        validateLostReasonExists(lostReasonId);

        Opportunity opportunity = findById(id);
        opportunity.update(name, customerId, stageId, statusId,
                lostReasonId, depositAmount, probability, description);
        opportunity.calculateRemaining();
        return opportunityRepository.save(opportunity);
    }

    public void delete(Integer id) {
        Opportunity opportunity = findById(id);
        opportunityRepository.delete(opportunity);
    }

    // ============ PRIVATE — Business Rules ============

    private void validateDuplicateCode(String code) {
        if (opportunityRepository.existsByOpportunityCode(code)) {
            throw new IllegalArgumentException("Mã cơ hội đã tồn tại");
        }
    }

    private void validateStageExists(Integer stageId) {
        if (stageId == null) return;
        stageRepository.findById(stageId)
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy giai đoạn với id: " + stageId));
    }

    private void validateStatusExists(Integer statusId) {
        if (statusId == null) return;
        statusRepository.findById(statusId)
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy trạng thái với id: " + statusId));
    }

    private void validateLostReasonExists(Integer lostReasonId) {
        if (lostReasonId == null) return;
        lostReasonRepository.findById(lostReasonId)
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy lý do thất bại với id: " + lostReasonId));
    }
}