package com.vti.crm.domain.service;

import com.vti.crm.domain.model.ProductImage;
import com.vti.crm.domain.repository.IProductImageRepository;

import java.util.List;

public class ProductImageDomainService {

    private final IProductImageRepository productImageRepository;

    public ProductImageDomainService(IProductImageRepository productImageRepository) {
        this.productImageRepository = productImageRepository;
    }

    public ProductImage save(Integer productId, String imageUrl) {
        ProductImage productImage = new ProductImage(productId, imageUrl);
        return productImageRepository.save(productImage);
    }

    public List<ProductImage> findByProductId(Integer productId) {
        return productImageRepository.findByProductId(productId);
    }

    public void deleteById(Integer id) {
        productImageRepository.findById(id); // kiểm tra tồn tại
        productImageRepository.deleteById(id);
    }

    public void deleteByProductId(Integer productId) {
        productImageRepository.deleteByProductId(productId);
    }
}