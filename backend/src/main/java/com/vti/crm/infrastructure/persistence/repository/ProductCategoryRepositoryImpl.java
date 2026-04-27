package com.vti.crm.infrastructure.persistence.repository;

import com.vti.crm.domain.model.ProductCategory;
import com.vti.crm.domain.repository.IProductCategoryRepository;
import com.vti.crm.infrastructure.persistence.entity.ProductCategoryDbEntity;
import com.vti.crm.infrastructure.persistence.mapper.ProductCategoryInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class ProductCategoryRepositoryImpl implements IProductCategoryRepository {

    private final JpaProductCategoryRepository jpaRepository;
    private final ProductCategoryInfraMapper mapper;

    @Override
    public ProductCategory save(ProductCategory productCategory) {
        ProductCategoryDbEntity dbEntity = mapper.toDbEntity(productCategory);
        ProductCategoryDbEntity saved = jpaRepository.save(dbEntity);
        return mapper.toDomainEntity(saved);
    }

    @Override
    public Optional<ProductCategory> findById(Integer id) {
        return jpaRepository.findByIdAndIsDeletedFalse(id)
                .map(mapper::toDomainEntity);
    }

    @Override
    public List<ProductCategory> findAllActive() {
        return jpaRepository.findByIsDeletedFalse()
                .stream()
                .map(mapper::toDomainEntity)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByName(String name) {
        return jpaRepository.existsByNameAndIsDeletedFalse(name);
    }

    @Override
    public boolean existsByNameExcludingId(Integer id, String name) {
        return jpaRepository.existsByNameExcludingId(id, name);
    }

    @Override
    public void softDeleteById(Integer id) {
        jpaRepository.softDeleteById(id);
    }
}