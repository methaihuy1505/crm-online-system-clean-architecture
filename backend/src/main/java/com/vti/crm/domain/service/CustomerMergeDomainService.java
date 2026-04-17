package com.vti.crm.domain.service;

import com.vti.crm.domain.model.Customer;

public class CustomerMergeDomainService {

    /**
     * Logic nghiệp vụ: Hợp nhất dữ liệu từ khách hàng duplicate sang khách hàng primary.
     */
    public void mergeDuplicates(Customer primary, Customer duplicate) {
        // 1. Kiểm tra luật kinh doanh (Business Rules)
        if (primary.getId().equals(duplicate.getId())) {
            throw new IllegalArgumentException("Lỗi: Không thể hợp nhất một khách hàng với chính họ!");
        }
        if ("MERGED".equals(duplicate.getStatus())) {
            throw new IllegalStateException("Lỗi: Khách hàng này đã bị hợp nhất trước đó, không thể dùng lại.");
        }

        // 2. Chuyển giao tài sản (Logic hợp nhất)
        // Ví dụ: Nếu khách chính chưa có số điện thoại, mà khách trùng lặp lại có, thì lấy số đó bù vào.
        if (primary.getPhone() == null && duplicate.getPhone() != null) {
            primary.update(primary.getFullName(), primary.getEmail(), duplicate.getPhone());
        }

        // 3. Đánh dấu khách hàng trùng lặp là "MERGED" (đã vô hiệu hóa)
        duplicate.markAsMerged();
    }
}