package com.vti.crm.interfaces.dto.response.opportunity;

import com.vti.crm.domain.model.Opportunity;
import com.vti.crm.infrastructure.persistence.entity.LostReasonDbEntity;
import com.vti.crm.infrastructure.persistence.entity.OpportunityStageDbEntity;
import com.vti.crm.infrastructure.persistence.entity.OpportunityStatusDbEntity;
import com.vti.crm.infrastructure.persistence.repository.opportunity.lost_reason.JpaLostReasonRepository;
import com.vti.crm.infrastructure.persistence.repository.opportunity.opportunity_stage.JpaOpportunityStageRepository;
import com.vti.crm.infrastructure.persistence.repository.opportunity.opportunity_status.JpaOpportunityStatusRepository;
import com.vti.crm.interfaces.mapper.OpportunityWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class OpportunityResponseEnricher {

    private final OpportunityWebMapper mapper;
    private final JpaOpportunityStageRepository stageRepository;
    private final JpaOpportunityStatusRepository statusRepository;
    private final JpaLostReasonRepository lostReasonRepository;

    // ── Single (dùng cho create / update / getById) ──────────────────────────
    public OpportunityResponse toResponse(Opportunity domain) {
        OpportunityResponse response = mapper.toResponse(domain);
        response.setStageName(resolveStageName(domain.getStage()));
        response.setStatusName(resolveStatusName(domain.getStatus()));
        response.setLostReasonName(resolveLostReasonName(domain.getLostReason()));
        return response;
    }

    // ── Batch (dùng cho getAll) — chỉ 3 query dù bao nhiêu opportunity ───────
    public List<OpportunityResponse> toResponses(List<Opportunity> opportunities) {
        Set<Integer> stageIds = opportunities.stream()
                .map(Opportunity::getStage)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Set<Integer> statusIds = opportunities.stream()
                .map(Opportunity::getStatus)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Set<Integer> lostReasonIds = opportunities.stream()
                .map(Opportunity::getLostReason)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<Integer, String> stageMap = stageRepository.findAllById(stageIds)
                .stream()
                .collect(Collectors.toMap(
                        OpportunityStageDbEntity::getId,
                        OpportunityStageDbEntity::getName
                ));

        Map<Integer, String> statusMap = statusRepository.findAllById(statusIds)
                .stream()
                .collect(Collectors.toMap(
                        OpportunityStatusDbEntity::getId,
                        OpportunityStatusDbEntity::getName
                ));

        Map<Integer, String> lostReasonMap = lostReasonRepository.findAllById(lostReasonIds)
                .stream()
                .collect(Collectors.toMap(
                        LostReasonDbEntity::getId,
                        LostReasonDbEntity::getName
                ));

        return opportunities.stream()
                .map(domain -> {
                    OpportunityResponse response = mapper.toResponse(domain);
                    response.setStageName(stageMap.getOrDefault(domain.getStage(), null));
                    response.setStatusName(statusMap.getOrDefault(domain.getStatus(), null));
                    response.setLostReasonName(lostReasonMap.getOrDefault(domain.getLostReason(), null));
                    return response;
                })
                .toList();
    }

    // ── Private helpers (dùng cho single) ────────────────────────────────────
    private String resolveStageName(Integer id) {
        if (id == null) return null;
        return stageRepository.findById(id)
                .map(OpportunityStageDbEntity::getName)
                .orElse(null);
    }

    private String resolveStatusName(Integer id) {
        if (id == null) return null;
        return statusRepository.findById(id)
                .map(OpportunityStatusDbEntity::getName)
                .orElse(null);
    }

    private String resolveLostReasonName(Integer id) {
        if (id == null) return null;
        return lostReasonRepository.findById(id)
                .map(LostReasonDbEntity::getName)
                .orElse(null);
    }
}