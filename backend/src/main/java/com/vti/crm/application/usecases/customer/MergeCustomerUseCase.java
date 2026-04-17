package com.vti.crm.application.usecases.customer;

import com.vti.crm.domain.model.Customer;
import com.vti.crm.domain.repository.ICustomerRepository;
import com.vti.crm.domain.service.CustomerMergeDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MergeCustomerUseCase {

    private final ICustomerRepository repository;

    // Khởi tạo Domain Service trực tiếp vì nó là Pure Java (không phụ thuộc Framework)
    private final CustomerMergeDomainService mergeDomainService = new CustomerMergeDomainService();

    @Transactional // Bắt buộc có Transaction vì ta sẽ update 2 dòng trong DB cùng lúc
    public void execute(Long primaryId, Long duplicateId) {
        // 1. Nhờ Thủ kho (Repo) kéo 2 thực thể từ Database lên RAM
        Customer primary = repository.findById(primaryId);
        Customer duplicate = repository.findById(duplicateId);

        // 2. Giao cho Trọng tài (Domain Service) xử lý logic hợp nhất
        mergeDomainService.mergeDuplicates(primary, duplicate);

        // 3. Cất cả 2 thực thể (đã được thay đổi trạng thái) xuống lại kho
        repository.save(primary);
        repository.save(duplicate);
    }
}