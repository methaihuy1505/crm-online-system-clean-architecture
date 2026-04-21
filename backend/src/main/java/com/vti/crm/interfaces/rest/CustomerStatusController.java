package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.customerstatus.GetAllCustomerStatusesUseCase;
import com.vti.crm.interfaces.dto.response.CustomerStatusResponse;
import com.vti.crm.interfaces.mapper.CustomerStatusWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customer-statuses")
@RequiredArgsConstructor
public class CustomerStatusController {

    private final GetAllCustomerStatusesUseCase useCase;
    private final CustomerStatusWebMapper webMapper;

    @GetMapping
    public ResponseEntity<List<CustomerStatusResponse>> getAllStatuses() {
        List<CustomerStatusResponse> responses = useCase.execute().stream()
                .map(webMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }
}