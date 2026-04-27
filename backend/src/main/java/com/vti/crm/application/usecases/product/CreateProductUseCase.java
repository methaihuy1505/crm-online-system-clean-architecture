// ============ CREATE ============
package com.vti.crm.application.usecases.product;

import com.vti.crm.domain.model.Product;
import com.vti.crm.domain.model.Product.ProductType;
import com.vti.crm.domain.model.ProductCategory;
import com.vti.crm.domain.model.ProductImage;
import com.vti.crm.domain.model.Uom;
import com.vti.crm.domain.repository.IProductCategoryRepository;
import com.vti.crm.domain.repository.IUomRepository;
import com.vti.crm.domain.service.ProductDomainService;
import com.vti.crm.domain.service.ProductImageDomainService;
import com.vti.crm.infrastructure.external.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.vti.crm.domain.repository.IProductRepository;

import java.math.BigDecimal;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CreateProductUseCase {

    private final ProductDomainService productDomainService;
    private final ProductImageDomainService productImageDomainService; // Đảm bảo đã inject service này
    private final CloudinaryService cloudinaryService; // Service upload ảnh bạn cần tạo
    private final IProductCategoryRepository categoryRepository;
    private final IUomRepository uomRepository;
    private final IProductRepository productRepository;

    public Product execute(String productCode,
                                 String name,
                                 Integer categoryID,
                                 Integer uomID,
                                 ProductType productType,
                                 BigDecimal basePrice,
                                 BigDecimal vatRate,
                                 BigDecimal depositOverride,
                                 MultipartFile file, // Thêm list file vào đây
                                 String description) {

        // 1. Tạo product
        Product product = productDomainService.create(
                productCode, name, categoryID, uomID, productType,
                basePrice, vatRate, depositOverride, null, description);
        System.out.println("DEBUG: Đang chuẩn bị lưu ảnh cho ProductID: " + product.getId() + " với URL: " + product.getImageUrl());
        // imageId truyền null


        // 2. Xử lý ảnh: Upload và lưu vào DB
        ProductImage productImage = null;
        String url = null;
        if (file != null && !file.isEmpty()) {
            // A. Upload lên Cloudinary
            url = cloudinaryService.upload(file);
            System.out.println("DEBUG: Đang chuẩn bị lưu ảnh cho ProductID: " + product.getId() + " với URL: " + url);
            // B. Lưu xuống DB qua Domain Service
            productImage = productImageDomainService.save(product.getId(), url);
        }

        // 3. Build response
        String categoryName = resolveCategoryName(categoryID);
        String uomName = resolveUomName(uomID);
        Product updated = productDomainService.update(
                product.getId(),
                product.getProductCode(),
                product.getName(),
                product.getCategoryID(),
                product.getUomID(), product.getProductType(),
                product.getBasePrice(),
                product.getVatRate(),
                product.getDepositOverride(),
                url,
                product.getDescription()
        );
        return updated;
    }

    private String resolveCategoryName(Integer id) {
        if (id == null) return null;
        return categoryRepository.findById(id)
                .map(ProductCategory::getName)
                .orElse(null);
    }

    private String resolveUomName(Integer id) {
        if (id == null) return null;
        return uomRepository.findById(id)
                .map(Uom::getName)
                .orElse(null);
    }
}