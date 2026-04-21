package com.vti.crm.application.usecases.contact;

import com.vti.crm.domain.model.Contact;
import com.vti.crm.domain.repository.IContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GetContactByIdUseCase {
    private final IContactRepository contactRepository;

    public Contact execute(Integer id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Người liên hệ với ID: " + id));
    }
}