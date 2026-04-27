package com.vti.crm.interfaces.dto.response;

import com.vti.crm.domain.repository.ILostReasonRepository;
import com.vti.crm.domain.repository.IOpportunityStageRepository;
import com.vti.crm.domain.repository.IOpportunityStatusRepository;
import com.vti.crm.domain.model.Opportunity;
import com.vti.crm.interfaces.dto.response.OpportunityResponse;
import com.vti.crm.interfaces.mapper.OpportunityWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OpportunityResponseEnricher {

    private final OpportunityWebMapper mapper;
    private final IOpportunityStageRepository stageRepository;
    private final IOpportunityStatusRepository statusRepository;
    private final ILostReasonRepository lostReasonRepository;

    public OpportunityResponse toResponse(Opportunity domain) {
        OpportunityResponse response = mapper.toResponse(domain);
        response.setStageName(resolveStageName(domain.getStage()));
        response.setStatusName(resolveStatusName(domain.getStatus()));
        response.setLostReasonName(resolveLostReasonName(domain.getLostReason()));
        return response;
    }

    private String resolveStageName(Integer id) {
        if (id == null) return null;
        return stageRepository.findById(id).map(s -> s.getName()).orElse(null);
    }

    private String resolveStatusName(Integer id) {
        if (id == null) return null;
        return statusRepository.findById(id).map(s -> s.getName()).orElse(null);
    }

    private String resolveLostReasonName(Integer id) {
        if (id == null) return null;
        return lostReasonRepository.findById(id).map(l -> l.getName()).orElse(null);
    }
}
