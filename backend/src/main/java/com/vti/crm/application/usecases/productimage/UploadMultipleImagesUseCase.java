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
public class UploadMultipleImagesUseCase {

    private final IProductImageRepository productImageRepository;

    public List<ProductImage> execute(Integer productId, List<String> imageUrls) {
        return imageUrls.stream()
                .map(url -> new ProductImage(null,productId , url))
                .map(productImageRepository::save)
                .toList();
    }
}