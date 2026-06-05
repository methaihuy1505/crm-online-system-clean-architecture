package com.vti.crm.application.usecases.customer;

import com.vti.crm.domain.model.Contact;
import com.vti.crm.domain.model.Customer;
import com.vti.crm.domain.repository.IContactRepository;
import com.vti.crm.domain.repository.ICustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeleteCustomerUseCase {

    private final ICustomerRepository customerRepository;
    private final IContactRepository contactRepository;

    @Transactional
    public void execute(Integer id,Integer currentUserId) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Khách hàng với ID: " + id));

        customer.softDelete(currentUserId);
        customerRepository.save(customer);

        // 2. Xóa mềm DÂY CHUYỀN toàn bộ Người liên hệ (Contact) của Khách hàng này
        List<Contact> relatedContacts = contactRepository.findByCustomerId(id);
        for (Contact contact : relatedContacts) {
            contact.softDelete(); // Gọi hành vi xóa mềm trong Rich Entity
            contactRepository.save(contact);
        }
    }
}