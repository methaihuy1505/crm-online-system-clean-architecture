package com.vti.crm.infrastructure.persistence.repository.lead.lead_status;

import com.vti.crm.domain.model.LeadStatus;
import com.vti.crm.domain.repository.ILeadStatusRepository;
import com.vti.crm.infrastructure.persistence.mapper.LeadStatusInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class LeadStatusRepositoryImpl implements ILeadStatusRepository {

    private final JpaLeadStatusRepository jpaRepository;
    private final LeadStatusInfraMapper mapper;

    @Override
    public List<LeadStatus> findActiveStatuses() {
        return jpaRepository.findByIsActiveTrue().stream()
                .map(mapper::toDomain)
                .toList();
    }
}