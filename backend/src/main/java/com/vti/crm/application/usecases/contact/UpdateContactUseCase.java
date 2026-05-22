package com.vti.crm.application.usecases.contact;

import com.vti.crm.domain.model.Contact;
import com.vti.crm.domain.model.Customer;
import com.vti.crm.domain.repository.*;
import com.vti.crm.domain.service.CommunicationDomainService;
import com.vti.crm.domain.service.CustomerContactDomainService;
import com.vti.crm.interfaces.dto.request.contact.ContactUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UpdateContactUseCase {

    private final IContactRepository contactRepository;
    private final ICustomerRepository customerRepository;
    private final ICommunicationRepository commRepository;

    // Khởi tạo 2 Trọng tài Domain Service (Pure Java)
    private final CustomerContactDomainService customerContactDomainService = new CustomerContactDomainService();
    private final CommunicationDomainService commDomainService = new CommunicationDomainService();

    @Transactional
    public Contact execute(Integer id, ContactUpdateRequest request) {
        // BƯỚC 1: Nhờ Thủ Kho (Repo) kéo dữ liệu từ DB lên
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Người liên hệ"));
        Customer customer = customerRepository.findById(contact.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Khách hàng trực thuộc"));
        List<Contact> currentPrimaries = contactRepository.findPrimaryContactsByCustomerId(customer.getId());

        // BƯỚC 2: Gọi Entity và Domain Service để xử lý logic B2C & Primary
        contact.updateInfo(request.getFirstName(), request.getLastName(), request.getJobTitle(), request.getBirthday(), request.getPersonalEmail(), request.getPersonalPhone(), request.getIsPrimary());

        if (Boolean.TRUE.equals(request.getIsPrimary())) {
            customerContactDomainService.processPrimaryContactAssignment(customer, contact, currentPrimaries);
        }

        boolean needSyncCustomer = customerContactDomainService.syncB2CContactToCustomer(customer, contact);

        // BƯỚC 3: Nhờ Thủ Kho (Repo) lưu cục dữ liệu đã thay đổi xuống DB
        contactRepository.save(contact);
        currentPrimaries.forEach(contactRepository::save); // Lưu những người bị hạ cấp
        if (needSyncCustomer || Boolean.TRUE.equals(request.getIsPrimary())) {
            customerRepository.save(customer);
        }

        // BƯỚC 4: LƯU VẾT LỊCH SỬ COMMUNICATION
        // Cập nhật lịch sử của Contact trước
        handleCommUpdate(contact.getId(), "CONTACT", request.getPersonalPhone(), "PHONE", "Số chính", "Số phụ");
        handleCommUpdate(contact.getId(), "CONTACT", request.getPersonalEmail(), "EMAIL", "Email chính", "Email phụ");

        // Nếu Contact này là B2C và đã đồng bộ data lên Customer, thì lưu vết cho cả Customer luôn!
        if (needSyncCustomer) {
            handleCommUpdate(customer.getId(), "CUSTOMER", customer.getMainPhone(), "PHONE", "Số chính", "Số phụ");
            handleCommUpdate(customer.getId(), "CUSTOMER", customer.getEmailOfficial(), "EMAIL", "Email chính", "Email phụ");
        }

        return contact;
    }

    // Hàm Helper private gọi Domain Service xử lý việc tạo mới / hạ cấp Số liên lạc
    private void handleCommUpdate(Integer parentId, String parentType, String newValue, String type, String primaryLabel, String secondaryLabel) {
        if (newValue == null || newValue.isBlank()) return;

        var currentPrimary = commRepository.findPrimary(parentId, parentType, type);
        var result = commDomainService.processUpdate(currentPrimary, newValue, parentId, parentType, type, primaryLabel, secondaryLabel);

        result.ifPresent(newComm -> {
            currentPrimary.ifPresent(commRepository::save); // Lưu số cũ bị hạ cấp
            commRepository.save(newComm); // Lưu số mới làm chính
        });
    }
}