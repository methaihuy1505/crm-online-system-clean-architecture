package com.vti.crm.infrastructure.persistence.repository;

import com.vti.crm.domain.model.Campaign;
import com.vti.crm.domain.repository.ICampaignRepository;
import com.vti.crm.infrastructure.persistence.entity.CampaignDbEntity;
import com.vti.crm.infrastructure.persistence.mapper.CampaignInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CampaignRepositoryImpl implements ICampaignRepository {

    private final JpaCampaignRepository jpaRepository; // JpaRepository cũ của bạn
    private final CampaignInfraMapper mapper;

    @Override
    public List<Campaign> findAll() {
        return jpaRepository.findAll().stream()
                .map(mapper::toDomain)
                .toList();
    }

    @Override
    public Optional<Campaign> findById(Integer id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Campaign save(Campaign campaign) {
        CampaignDbEntity entity = mapper.toEntity(campaign);
        CampaignDbEntity savedEntity = jpaRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }

    @Override
    public void delete(Integer id) {
        jpaRepository.findById(id).ifPresent(entity -> {
            entity.setDeletedAt(LocalDateTime.now());
            jpaRepository.save(entity);
        });
    }
}