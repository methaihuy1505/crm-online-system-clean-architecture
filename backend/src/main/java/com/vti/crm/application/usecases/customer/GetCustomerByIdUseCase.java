package com.vti.crm.application.usecases.customer;

import com.vti.crm.domain.model.Customer;
import com.vti.crm.domain.repository.ICustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetCustomerByIdUseCase {
    private final ICustomerRepository customerRepository;

    // 🌟 THÊM currentUserId, roleId VÀO THAM SỐ
    public Customer execute(Integer id, Integer currentUserId, Integer roleId) {

        // 🌟 LOGIC PHÂN QUYỀN
        Integer filterUserId = (roleId != null && (roleId == 1 || roleId == 4)) ? null : currentUserId;

        // Gọi hàm kiểm tra an toàn từ DB
        return customerRepository.findByIdWithFilter(id, filterUserId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy Khách hàng, hoặc bạn không có quyền truy cập dữ liệu này."));
    }
}