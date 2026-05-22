package com.vti.crm.infrastructure.persistence.repository.product.product_image;

import com.vti.crm.domain.model.ProductImage;
import com.vti.crm.domain.repository.IProductImageRepository;
import com.vti.crm.infrastructure.persistence.entity.ProductImageDbEntity;
import com.vti.crm.infrastructure.persistence.mapper.ProductImageInfraMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class ProductImageRepositoryImpl implements IProductImageRepository {

    private final JpaProductImageRepository jpaRepository;
    private final ProductImageInfraMapper mapper;

    @Override
    public ProductImage save(ProductImage productImage) {
        ProductImageDbEntity dbEntity = mapper.toDbEntity(productImage);
        ProductImageDbEntity saved = jpaRepository.save(dbEntity);
        return mapper.toDomainEntity(saved);
    }

    @Override
    public ProductImage findById(Integer id) {
        return jpaRepository.findById(id)
                .map(mapper::toDomainEntity)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ảnh với id: " + id));
    }

    @Override
    public List<ProductImage> findByProductId(Integer productId) {
        return jpaRepository.findByProductIdOrderBySortOrderAsc(productId)
                .stream()
                .map(mapper::toDomainEntity)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Integer id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public void deleteByProductId(Integer productId) {
        jpaRepository.deleteByProductId(productId);
    }
}