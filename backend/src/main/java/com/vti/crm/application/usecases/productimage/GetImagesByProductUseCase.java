package com.vti.crm.application.usecases.productimage;

import com.vti.crm.domain.model.ProductImage;
import com.vti.crm.domain.repository.IProductImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetImagesByProductUseCase {

    private final IProductImageRepository productImageRepository;

    public List<ProductImage> execute(Integer productId) {
        return productImageRepository.findByProductId(productId);
    }
}