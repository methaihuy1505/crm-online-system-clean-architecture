package com.vti.crm.infrastructure.persistence.repository.lead.lead_interest;

import com.vti.crm.domain.repository.ILeadInterestRepository;
import com.vti.crm.infrastructure.persistence.entity.LeadInterestDbEntity;
import com.vti.crm.infrastructure.persistence.repository.lead.JpaLeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class LeadInterestRepositoryImpl implements ILeadInterestRepository {

    private final JpaLeadInterestRepository jpaRepository;

    private final JpaLeadRepository leadJpaRepository;

    @Override
    public void saveInterests(Integer leadId, List<Integer> productIds) {
        if (productIds == null || productIds.isEmpty()) return;

        List<LeadInterestDbEntity> entities = productIds.stream()
                .map(productId -> {
                    LeadInterestDbEntity entity = new LeadInterestDbEntity();
                    entity.setLead(leadJpaRepository.getReferenceById(leadId));
                    entity.setProductId(productId);
                    return entity;
                }).toList();

        jpaRepository.saveAll(entities);
    }

    @Override
    public void deleteByLeadId(Integer leadId) {
        jpaRepository.deleteByLeadId(leadId);
    }

    @Override
    public List<Integer> findProductIdsByLeadId(Integer leadId) {
        return jpaRepository.findProductIdsByLeadId(leadId);
    }
}