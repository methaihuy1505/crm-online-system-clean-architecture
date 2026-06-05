package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.contact.*;
import com.vti.crm.interfaces.dto.request.contact.ContactCreateRequest;
import com.vti.crm.interfaces.dto.request.contact.ContactUpdateRequest;
import com.vti.crm.interfaces.dto.response.contact.ContactResponse;
import com.vti.crm.interfaces.mapper.ContactWebMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/contacts")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('contacts.view')")
public class ContactController {

    private final CreateContactUseCase createContactUseCase;
    private final GetAllContactsUseCase getAllContactsUseCase;
    private final GetContactByIdUseCase getContactByIdUseCase;
    private final GetContactsByCustomerIdUseCase getContactsByCustomerIdUseCase;
    private final UpdateContactUseCase updateContactUseCase;
    private final DeleteContactUseCase deleteContactUseCase;

    private final ContactWebMapper webMapper;

    @PostMapping
    @PreAuthorize("hasAuthority('contacts.create')")
    public ResponseEntity<ContactResponse> createContact(@Valid @RequestBody ContactCreateRequest request) {
        ContactResponse response = webMapper.toResponse(createContactUseCase.execute(request));
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ContactResponse>> getAllContacts(
            @RequestParam(required = false) String keyword) {
        List<ContactResponse> responses = getAllContactsUseCase.execute(keyword).stream()
                .map(webMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactResponse> getContactById(@PathVariable Integer id) {
        return ResponseEntity.ok(webMapper.toResponse(getContactByIdUseCase.execute(id)));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<ContactResponse>> getContactsByCustomerId(@PathVariable Integer customerId) {
        List<ContactResponse> responses = getContactsByCustomerIdUseCase.execute(customerId).stream()
                .map(webMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('contacts.update')")
    public ResponseEntity<ContactResponse> updateContact(
            @PathVariable Integer id,
            @Valid @RequestBody ContactUpdateRequest request) {
        return ResponseEntity.ok(webMapper.toResponse(updateContactUseCase.execute(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('contacts.delete')")
    public ResponseEntity<Void> deleteContact(@PathVariable Integer id) {
        deleteContactUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}