package com.vti.crm.application.usecases.contact;

import com.vti.crm.domain.model.Contact;
import com.vti.crm.domain.model.Customer;
import com.vti.crm.domain.model.CommunicationDetail;
import com.vti.crm.domain.repository.IContactRepository;
import com.vti.crm.domain.repository.ICustomerRepository;
import com.vti.crm.domain.repository.ICommunicationRepository;
import com.vti.crm.interfaces.dto.request.ContactCreateRequest;
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

    @Transactional
    public Contact execute(ContactCreateRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Khách hàng với ID: " + request.getCustomerId()));

        // 1. Tạo Model Contact
        Contact contact = Contact.create(
                customer.getId(), request.getFirstName(), request.getLastName(),
                request.getJobTitle(), request.getBirthday(), request.getPersonalEmail(),
                request.getPersonalPhone(), request.getIsPrimary()
        );

        Contact savedContact = contactRepository.save(contact);

        // 2. Lưu kho liên lạc
        saveDefaultComm(savedContact.getId(), "CONTACT", "PHONE", request.getPersonalPhone(), "Số chính");
        saveDefaultComm(savedContact.getId(), "CONTACT", "EMAIL", request.getPersonalEmail(), "Email chính");

        // 3. Xử lý logic nếu đây là liên hệ chính
        if (Boolean.TRUE.equals(request.getIsPrimary())) {
            handlePrimaryContactLogic(customer, savedContact);
        }

        return savedContact;
    }

    private void saveDefaultComm(Integer id, String parentType, String type, String value, String label) {
        if (value != null && !value.isBlank()) {
            commRepository.save(CommunicationDetail.createNew(id, parentType, type, value, label, true));
        }
    }

    private void handlePrimaryContactLogic(Customer customer, Contact newPrimaryContact) {
        // Lấy tất cả các liên hệ đang là Primary của khách hàng này
        List<Contact> currentPrimaries = contactRepository.findPrimaryContactsByCustomerId(customer.getId());

        // Hạ cấp họ xuống thành false (dùng hành vi của Rich Entity)
        for (Contact c : currentPrimaries) {
            if (!c.getId().equals(newPrimaryContact.getId())) {
                c.demoteFromPrimary();
                contactRepository.save(c);
            }
        }

        // Cập nhật ID này vào bảng Customer
        customer.assignPrimaryContact(newPrimaryContact.getId());
        customerRepository.save(customer);
    }
}