package com.vti.crm.application.usecases.contact;

import com.vti.crm.domain.model.Contact;
import com.vti.crm.domain.repository.IContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GetAllContactsUseCase {
    private final IContactRepository contactRepository;

    public List<Contact> execute(String keyword) { // 🌟 THÊM THAM SỐ
        if (keyword != null && !keyword.trim().isEmpty()) {
            return contactRepository.searchByKeyword(keyword.trim());
        }
        return contactRepository.findAll();
    }
}