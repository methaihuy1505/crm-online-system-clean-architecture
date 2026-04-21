package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.customer.*;
import com.vti.crm.interfaces.dto.request.CustomerCreateRequest;
import com.vti.crm.interfaces.dto.request.CustomerUpdateRequest;
import com.vti.crm.interfaces.dto.response.CustomerResponse;
import com.vti.crm.interfaces.mapper.CustomerWebMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CreateCustomerUseCase createUseCase;
    private final UpdateCustomerUseCase updateUseCase;
    private final GetCustomerByIdUseCase getByIdUseCase;
    private final GetAllCustomersUseCase getAllUseCase;
    private final DeleteCustomerUseCase deleteUseCase;
    private final CustomerWebMapper webMapper;

    @PostMapping
    public ResponseEntity<CustomerResponse> createCustomer(@Valid @RequestBody CustomerCreateRequest request) {
        CustomerResponse response = webMapper.toResponse(createUseCase.execute(request));
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CustomerResponse>> getAllCustomers() {
        List<CustomerResponse> responses = getAllUseCase.execute().stream()
                .map(webMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getCustomerById(@PathVariable Integer id) {
        return ResponseEntity.ok(webMapper.toResponse(getByIdUseCase.execute(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponse> updateCustomer(
            @PathVariable Integer id,
            @Valid @RequestBody CustomerUpdateRequest request) {
        return ResponseEntity.ok(webMapper.toResponse(updateUseCase.execute(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Integer id) {
        deleteUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}