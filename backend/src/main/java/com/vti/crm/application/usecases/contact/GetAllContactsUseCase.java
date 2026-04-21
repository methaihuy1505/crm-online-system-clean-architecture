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

    public List<Contact> execute() {
        return contactRepository.findAll();
    }
}