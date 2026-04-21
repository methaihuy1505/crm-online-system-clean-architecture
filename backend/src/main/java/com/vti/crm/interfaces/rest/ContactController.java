package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.contact.*;
import com.vti.crm.interfaces.dto.request.ContactCreateRequest;
import com.vti.crm.interfaces.dto.request.ContactUpdateRequest;
import com.vti.crm.interfaces.dto.response.ContactResponse;
import com.vti.crm.interfaces.mapper.ContactWebMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final CreateContactUseCase createContactUseCase;
    private final GetAllContactsUseCase getAllContactsUseCase;
    private final GetContactByIdUseCase getContactByIdUseCase;
    private final GetContactsByCustomerIdUseCase getContactsByCustomerIdUseCase;
    private final UpdateContactUseCase updateContactUseCase;
    private final DeleteContactUseCase deleteContactUseCase;

    private final ContactWebMapper webMapper;

    @PostMapping
    public ResponseEntity<ContactResponse> createContact(@Valid @RequestBody ContactCreateRequest request) {
        ContactResponse response = webMapper.toResponse(createContactUseCase.execute(request));
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ContactResponse>> getAllContacts() {
        List<ContactResponse> responses = getAllContactsUseCase.execute().stream()
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
    public ResponseEntity<ContactResponse> updateContact(
            @PathVariable Integer id,
            @Valid @RequestBody ContactUpdateRequest request) {
        return ResponseEntity.ok(webMapper.toResponse(updateContactUseCase.execute(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Integer id) {
        deleteContactUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}