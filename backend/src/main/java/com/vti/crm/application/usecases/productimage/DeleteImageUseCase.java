package com.vti.crm.application.usecases.productimage;

import com.vti.crm.domain.repository.IProductImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DeleteImageUseCase {

    private final IProductImageRepository productImageRepository;

    public void execute(Integer id) {
        productImageRepository.findById(id); // kiểm tra tồn tại
        productImageRepository.deleteById(id);
    }
}