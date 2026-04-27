package com.vti.crm.infrastructure.persistence.repository;

import com.vti.crm.domain.model.Product;
import com.vti.crm.domain.repository.IProductRepository;
import com.vti.crm.domain.service.ProductDomainService;
import com.vti.crm.infrastructure.persistence.entity.ProductDbEntity;
import com.vti.crm.infrastructure.persistence.mapper.ProductInfraMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class ProductRepositoryImpl implements IProductRepository {

    private final JpaProductRepository jpaRepository;
    private final ProductInfraMapper mapper;
    private static final Logger logger = LoggerFactory.getLogger(ProductDomainService.class);
    @Override
    public Product save(Product product) {
        ProductDbEntity dbEntity = mapper.toDbEntity(product);
        ProductDbEntity saved = jpaRepository.save(dbEntity);
        Product domain = mapper.toDomainEntity(saved);

        return domain;
    }

    @Override
    public Optional<Product> findById(Integer id) {
        return jpaRepository.findByIdAndIsDeletedFalse(id)
                .map(mapper::toDomainEntity);
    }

    @Override
    public List<Product> findAllActive() {
        return jpaRepository.findByIsDeletedFalse()
                .stream()
                .map(mapper::toDomainEntity)
                .collect(Collectors.toList());
    }

    @Override
    public boolean existsByProductCode(String productCode) {
        return jpaRepository.existsByProductCodeAndIsDeletedFalse(productCode);
    }

    @Override
    public boolean existsByProductCodeExcludingId(Integer id, String productCode) {
        return jpaRepository.existsByProductCodeExcludingId(id, productCode);
    }

    @Override
    public void save(Product product, boolean update) {

    }
}