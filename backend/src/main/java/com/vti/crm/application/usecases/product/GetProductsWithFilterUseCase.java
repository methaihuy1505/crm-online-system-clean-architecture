package com.vti.crm.application.usecases.product;

import com.vti.crm.domain.model.Product;
import com.vti.crm.domain.model.ProductFilter;
import com.vti.crm.domain.repository.IProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GetProductsWithFilterUseCase {

    private final IProductRepository productRepository;

    public List<Product> execute(ProductFilter filter) {
        return productRepository.findAllWithFilter(filter);
    }
}