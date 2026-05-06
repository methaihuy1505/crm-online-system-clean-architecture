package com.vti.crm.infrastructure.persistence.repository;

import com.vti.crm.domain.model.Campaign;
import com.vti.crm.domain.repository.ICampaignRepository;
import com.vti.crm.infrastructure.persistence.entity.CampaignDbEntity;
import com.vti.crm.infrastructure.persistence.mapper.CampaignInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CampaignRepositoryImpl implements ICampaignRepository {

    private final JpaCampaignRepository jpaRepository;
    private final CampaignInfraMapper mapper;

    @Override
    public Page<Campaign> searchCampaigns(String keyword, List<String> statuses, LocalDate fromDate, LocalDate toDate, Pageable pageable) {
        return jpaRepository.searchCampaigns(keyword, statuses, fromDate, toDate, pageable)
                .map(mapper::toDomain);
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

    @Override
    public List<Campaign> findOptions(int limit) {
        Pageable limitRequest = PageRequest.of(0, limit);
        List<CampaignDbEntity> entities = jpaRepository.findAllByOrderByStartDateDesc(limitRequest);
        return entities.stream().map(mapper::toDomain).toList();
    }
}