package com.vti.crm.application.usecases.contact;

import com.vti.crm.domain.model.Contact;
import com.vti.crm.domain.repository.IContactRepository;
import com.vti.crm.domain.repository.ICustomerRepository;
import com.vti.crm.domain.service.CustomerContactDomainService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DeleteContactUseCase {

    private final IContactRepository contactRepository;
    private final ICustomerRepository customerRepository;

    // Khởi tạo Trọng tài
    private final CustomerContactDomainService domainService = new CustomerContactDomainService();

    @Transactional
    public void execute(Integer id) {
        // BƯỚC 1: Kéo dữ liệu từ DB lên
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Người liên hệ với ID: " + id));

        // BƯỚC 2: Xử lý logic gỡ Liên hệ chính (Tương tác 2 thực thể)
        customerRepository.findById(contact.getCustomerId()).ifPresent(customer -> {
            // Nhờ Domain Service phán xử xem có cần gỡ Primary không
            boolean needUpdateCustomer = domainService.processContactDeletion(customer, contact);

            // BƯỚC 3: Lưu Customer nếu Trọng tài báo có thay đổi
            if (needUpdateCustomer) {
                customerRepository.save(customer);
            }
        });

        // Xử lý Xóa mềm bản thân Contact (Tương tác 1 thực thể -> Gọi Rich Entity)
        contact.softDelete();
        contactRepository.save(contact);
    }
}