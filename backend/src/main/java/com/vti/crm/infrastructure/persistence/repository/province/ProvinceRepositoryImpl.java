package com.vti.crm.infrastructure.persistence.repository.province;

import com.vti.crm.domain.model.Province;
import com.vti.crm.domain.repository.IProvinceRepository;
import com.vti.crm.infrastructure.persistence.mapper.ProvinceInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class ProvinceRepositoryImpl implements IProvinceRepository {
    private final JpaProvinceRepository jpaRepository;
    private final ProvinceInfraMapper mapper;

    @Override public List<Province> findAll() {
        return jpaRepository.findAll().stream().map(mapper::toDomain).collect(Collectors.toList());
    }
    @Override public Optional<Province> findById(Integer id) {
        return jpaRepository.findById(id).map(mapper::toDomain);
    }
    @Override public Province save(Province province) {
        return mapper.toDomain(jpaRepository.save(mapper.toEntity(province)));
    }
    @Override public void deleteById(Integer id) { jpaRepository.deleteById(id); }
}