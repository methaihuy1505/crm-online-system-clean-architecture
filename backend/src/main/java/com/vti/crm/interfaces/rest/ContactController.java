package com.vti.crm.controller;

import com.vti.crm.dto.request.ContactCreateRequest;
import com.vti.crm.dto.request.ContactUpdateRequest;
import com.vti.crm.dto.response.ContactResponse;
import com.vti.crm.service.ContactService;
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

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<ContactResponse> createContact(@Valid @RequestBody ContactCreateRequest request) {
        return new ResponseEntity<>(contactService.createContact(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ContactResponse>> getAllContacts() {
        return ResponseEntity.ok(contactService.getAllContacts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactResponse> getContactById(@PathVariable Integer id) {
        return ResponseEntity.ok(contactService.getContactById(id));
    }

    // API lấy danh sách Liên hệ theo ID Công ty
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<ContactResponse>> getContactsByCustomerId(@PathVariable Integer customerId) {
        return ResponseEntity.ok(contactService.getContactsByCustomerId(customerId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactResponse> updateContact(
            @PathVariable Integer id,
            @Valid @RequestBody ContactUpdateRequest request) {
        return ResponseEntity.ok(contactService.updateContact(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Integer id) {
        contactService.deleteContact(id);
        return ResponseEntity.noContent().build();
    }
}