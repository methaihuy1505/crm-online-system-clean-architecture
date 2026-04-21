package com.vti.crm.infrastructure.persistence.repository;

import com.vti.crm.domain.model.Source;
import com.vti.crm.domain.repository.ISourceRepository;
import com.vti.crm.infrastructure.persistence.mapper.SourceInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class SourceRepositoryImpl implements ISourceRepository {

    private final JpaSourceRepository jpaRepository;
    private final SourceInfraMapper mapper;

    @Override
    public List<Source> findActiveSources() {
        return jpaRepository.findByIsActiveTrue().stream()
                .map(mapper::toDomain)
                .toList();
    }
}