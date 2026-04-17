package com.vti.crm.application.usecases.customer;

import com.vti.crm.domain.model.Customer;
import com.vti.crm.domain.repository.ICustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UpgradeCustomerToVipUseCase {

    private final ICustomerRepository repository;

    public void execute(Long id) {
        // 1. Lấy Thực thể từ kho
        Customer customer = repository.findById(id);

        // 2. Gọi hàm nghiệp vụ (trường hợp rich entity)
        // Lớp Application không thèm biết quy tắc VIP là gì, nó giao phó hoàn toàn cho Domain tự xử lý.
        customer.upgradeToVip();

        // 3. Cất lại xuống kho
        repository.save(customer);
    }
}