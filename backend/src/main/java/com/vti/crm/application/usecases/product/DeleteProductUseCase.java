// ============ DELETE ============
package com.vti.crm.application.usecases.product;

import com.vti.crm.domain.service.ProductDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DeleteProductUseCase {

    private final ProductDomainService productDomainService;

    public void execute(Integer id) {
        productDomainService.delete(id);
    }
}