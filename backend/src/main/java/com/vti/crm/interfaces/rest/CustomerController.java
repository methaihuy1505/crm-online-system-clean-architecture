package com.vti.crm.interfaces.rest;


import com.vti.crm.application.usecases.customer.*;
import com.vti.crm.interfaces.dto.request.CustomerCreateRequest;
import com.vti.crm.interfaces.dto.request.CustomerMergeRequest;
import com.vti.crm.interfaces.dto.request.CustomerUpdateRequest;
import com.vti.crm.interfaces.dto.response.CustomerResponseDTO;
import com.vti.crm.interfaces.mapper.CustomerWebMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    // Inject các UseCase riêng biệt thay vì 1 Service khổng lồ
    private final CreateCustomerUseCase createUseCase;
    private final GetCustomerUseCase getUseCase;
    private final UpdateCustomerUseCase updateUseCase;
    private final DeleteCustomerUseCase deleteUseCase;
    private final UpgradeCustomerToVipUseCase upgradeVipUseCase;
    private final MergeCustomerUseCase mergeUseCase;

    private final CustomerWebMapper webMapper;

    @PostMapping
    public ResponseEntity<String> createCustomer(@Valid @RequestBody CustomerCreateRequest request) {
        createUseCase.execute(request.getFullName(), request.getEmail(), request.getPhone());
        return ResponseEntity.status(HttpStatus.CREATED).body("Tạo khách hàng thành công!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody CustomerUpdateRequest request) {
        updateUseCase.execute(id, request.getFullName(), request.getEmail(), request.getPhone());
        return ResponseEntity.ok("Cập nhật thành công!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCustomer(@PathVariable Long id) {
        deleteUseCase.execute(id);
        return ResponseEntity.ok("Xóa thành công!");
    }

    // LUỒNG ĐỌC BÂY GIỜ PHẢI ĐI XUYÊN QUA USE CASE VÀ DOMAIN
    @GetMapping
    public ResponseEntity<List<CustomerResponseDTO>> getAllCustomers() {
        List<CustomerResponseDTO> responses = getUseCase.executeGetAll()
                .stream()
                .map(webMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> getCustomerById(@PathVariable Long id) {
        CustomerResponseDTO response = webMapper.toResponse(getUseCase.executeGetById(id));
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/upgrade-vip")
    public ResponseEntity<String> upgradeToVip(@PathVariable Long id) {
        // Trình điều phối gọi thẳng UseCase, không cần truyền DTO rườm rà vì chỉ cần ID
        upgradeVipUseCase.execute(id);
        return ResponseEntity.ok("Chúc mừng! Khách hàng đã được nâng cấp lên hạng VIP.");
    }

    @PostMapping("/{id}/merge")
    public ResponseEntity<String> mergeCustomers(
            @PathVariable Long id,
            @Valid @RequestBody CustomerMergeRequest request) {

        mergeUseCase.execute(id, request.getDuplicateCustomerId());
        return ResponseEntity.ok("Hợp nhất khách hàng trùng lặp thành công!");
    }
}