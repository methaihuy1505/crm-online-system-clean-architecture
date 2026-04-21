package com.vti.crm.infrastructure.persistence.repository;

import com.vti.crm.domain.model.Lead;
import com.vti.crm.domain.repository.ILeadRepository;
import com.vti.crm.infrastructure.persistence.entity.LeadDbEntity;
import com.vti.crm.infrastructure.persistence.mapper.LeadInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class LeadRepositoryImpl implements ILeadRepository {
    private final JpaLeadRepository jpaRepository;
    private final LeadInfraMapper mapper;

    @Override
    public Lead save(Lead lead) {
        LeadDbEntity entity = mapper.toEntity(lead);
        return mapper.toDomain(jpaRepository.save(entity));
    }

    @Override
    public Optional<Lead> findById(Integer id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public List<Lead> findAll() {
        return jpaRepository.findAll().stream().map(mapper::toDomain).toList();
    }

    @Override
    public List<Lead> findByCampaignId(Integer campaignId) {
        return jpaRepository.findByCampaignId(campaignId).stream()
                .map(mapper::toDomain)
                .toList();
    }
}