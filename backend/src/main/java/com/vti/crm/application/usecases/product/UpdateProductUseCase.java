// ============ UPDATE ============
package com.vti.crm.application.usecases.product;

import com.vti.crm.domain.model.Product;
import com.vti.crm.domain.model.Product.ProductType;
import com.vti.crm.domain.repository.IProductCategoryRepository;
import com.vti.crm.domain.repository.IProductImageRepository;
import com.vti.crm.domain.repository.IUomRepository;
import com.vti.crm.domain.service.ProductDomainService;
import com.vti.crm.infrastructure.external.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional
public class UpdateProductUseCase {

    private final ProductDomainService productDomainService;
    private final IProductCategoryRepository categoryRepository;
    private final IUomRepository uomRepository;
    private final IProductImageRepository productImageRepository;
    private final CloudinaryService cloudinaryService;

//    public Product execute(Integer id,
//                                 String productCode,
//                                 String name,
//                                 Integer categoryID,
//                                 Integer uomID,
//                                 ProductType productType,
//                                 BigDecimal basePrice,
//                                 BigDecimal vatRate,
//                                 BigDecimal depositOverride,
//                                 String imageUrl,
//                                 String description) {
//
//        // 1. Update qua domain service
//        Product product = productDomainService.update(
//                id, productCode, name, categoryID, uomID, productType,
//                basePrice, vatRate, depositOverride, imageUrl, description);
//
//
//
//        return product;
//    }
    public Product execute(Integer id,
                           String productCode,
                           String name,
                           Integer categoryId,
                           Integer uomId,
                           Product.ProductType productType,
                           BigDecimal basePrice,
                           BigDecimal vatRate,
                           BigDecimal depositOverride,
                           MultipartFile newImage,
                           String description) {

        // 1. Lấy product hiện tại để lấy imageUrl cũ
        Product existing = productDomainService.findById(id);

        // 2. Xử lý ảnh — chỉ thực hiện khi có ảnh mới
        String imageUrl = existing.getImageUrl(); // giữ ảnh cũ mặc định
        if (newImage != null && !newImage.isEmpty()) {
            cloudinaryService.validateFile(newImage);

            // Xóa ảnh cũ trên Cloudinary nếu có
            if (imageUrl != null && !imageUrl.isBlank()) {
                cloudinaryService.delete(imageUrl);
            }

            // Upload ảnh mới
            imageUrl = cloudinaryService.upload(newImage);
        }

        // 3. Gọi DomainService update
        return productDomainService.update(
                id, productCode, name, categoryId, uomId,
                productType, basePrice, vatRate, depositOverride,
                imageUrl, description
        );
    }
}