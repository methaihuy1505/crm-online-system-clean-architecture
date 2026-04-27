package com.vti.crm.application.usecases.productimage;

import com.vti.crm.domain.model.ProductImage;
import com.vti.crm.domain.repository.IProductImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReplaceImagesUseCase {

    private final IProductImageRepository productImageRepository;
    private final UploadMultipleImagesUseCase uploadMultipleImagesUseCase;

    public List<ProductImage> execute(Integer productId, List<String> imageUrls) {
        productImageRepository.deleteByProductId(productId); // 1. xóa hết ảnh cũ
        return uploadMultipleImagesUseCase.execute(productId, imageUrls); // 2. upload ảnh mới
    }
}