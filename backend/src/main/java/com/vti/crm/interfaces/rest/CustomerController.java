package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.customer.*;
import com.vti.crm.infrastructure.security.CustomUserDetails;
import com.vti.crm.interfaces.dto.request.customer.CustomerCreateRequest;
import com.vti.crm.interfaces.dto.request.customer.CustomerUpdateRequest;
import com.vti.crm.interfaces.dto.response.customer.CustomerResponse;
import com.vti.crm.interfaces.mapper.CustomerWebMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CreateCustomerUseCase createUseCase;
    private final UpdateCustomerUseCase updateUseCase;
    private final GetCustomerByIdUseCase getByIdUseCase;
    private final GetAllCustomersUseCase getAllCustomersUseCase;
    private final DeleteCustomerUseCase deleteUseCase;
    private final CustomerWebMapper webMapper;

    @PostMapping
    @PreAuthorize("hasAuthority('customers.create')")
    public ResponseEntity<CustomerResponse> createCustomer(
            @Valid @RequestBody CustomerCreateRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {

        CustomerResponse response = webMapper.toResponse(createUseCase.execute(request, currentUser.getId()));
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<CustomerResponse>> getAllCustomers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) List<Integer> statusIds,
            @RequestParam(required = false) List<Integer> rankIds,
            @RequestParam(required = false) Boolean isOrganization,
            @RequestParam(required = false) List<Integer> sourceIds,
            @RequestParam(required = false) List<Integer> campaignIds,
            Pageable pageable,
            @AuthenticationPrincipal CustomUserDetails currentUser // 🌟 BƠM TOKEN VÀO ĐÂY
    ) {
        Page<CustomerResponse> responses = getAllCustomersUseCase.execute(
                keyword, statusIds, rankIds, isOrganization, sourceIds, campaignIds, pageable,
                currentUser.getId(), currentUser.getRoleId() // 🌟 TRUYỀN XUỐNG USECASE
        ).map(webMapper::toResponse);

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getCustomerById(
            @PathVariable Integer id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {

        return ResponseEntity.ok(webMapper.toResponse(getByIdUseCase.execute(id, currentUser.getId(), currentUser.getRoleId())));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('customers.update')")
    public ResponseEntity<CustomerResponse> updateCustomer(
            @PathVariable Integer id,
            @Valid @RequestBody CustomerUpdateRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {

        return ResponseEntity.ok(webMapper.toResponse(updateUseCase.execute(id, request, currentUser.getId())));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('customers.delete')")
    public ResponseEntity<Void> deleteCustomer(
            @PathVariable Integer id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {

        deleteUseCase.execute(id, currentUser.getId());
        return ResponseEntity.noContent().build();
    }
}