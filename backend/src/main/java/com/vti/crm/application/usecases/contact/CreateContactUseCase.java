package com.vti.crm.application.usecases.contact;

import com.vti.crm.domain.model.Contact;
import com.vti.crm.domain.model.Customer;
import com.vti.crm.domain.model.CommunicationDetail;
import com.vti.crm.domain.repository.IContactRepository;
import com.vti.crm.domain.repository.ICustomerRepository;
import com.vti.crm.domain.repository.ICommunicationRepository;
import com.vti.crm.domain.service.CustomerContactDomainService;
import com.vti.crm.interfaces.dto.request.contact.ContactCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CreateContactUseCase {

    private final IContactRepository contactRepository;
    private final ICustomerRepository customerRepository;
    private final ICommunicationRepository commRepository;

    private final CustomerContactDomainService domainService = new CustomerContactDomainService();

    @Transactional
    public Contact execute(ContactCreateRequest request) {
        // BƯỚC 1: Kéo dữ liệu từ DB lên
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Khách hàng với ID: " + request.getCustomerId()));
        List<Contact> currentPrimaries = contactRepository.findPrimaryContactsByCustomerId(customer.getId());

        // BƯỚC 2: Khởi tạo Model Contact và lưu tạm để lấy ID
        Contact contact = Contact.create(
                customer.getId(), request.getFirstName(), request.getLastName(),
                request.getJobTitle(), request.getBirthday(), request.getPersonalEmail(),
                request.getPersonalPhone(), request.getIsPrimary()
        );
        Contact savedContact = contactRepository.save(contact);

        // BƯỚC 3: Nhờ Trọng tài xử lý nghiệp vụ Liên hệ chính (Không dùng vòng lặp ở đây nữa)
        if (Boolean.TRUE.equals(request.getIsPrimary())) {
            domainService.processPrimaryContactAssignment(customer, savedContact, currentPrimaries);

            // Lưu lại những đối tượng đã bị thay đổi trạng thái
            currentPrimaries.forEach(contactRepository::save); // Lưu những người cũ bị hạ cấp
            customerRepository.save(customer); // Lưu khách hàng có ID liên hệ chính mới
        }

        // BƯỚC 4: Lưu kho liên lạc (Hạ tầng)
        saveDefaultComm(savedContact.getId(), "CONTACT", "PHONE", request.getPersonalPhone(), "Số chính");
        saveDefaultComm(savedContact.getId(), "CONTACT", "EMAIL", request.getPersonalEmail(), "Email chính");

        return savedContact;
    }

    // Hàm Helper private chỉ phục vụ hạ tầng tạo data, không chứa logic nghiệp vụ
    private void saveDefaultComm(Integer id, String parentType, String type, String value, String label) {
        if (value != null && !value.isBlank()) {
            commRepository.save(CommunicationDetail.createNew(id, parentType, type, value, label, true));
        }
    }
}