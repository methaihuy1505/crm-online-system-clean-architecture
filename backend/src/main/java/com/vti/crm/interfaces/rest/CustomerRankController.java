package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.customerrank.GetAllCustomerRanksUseCase;
import com.vti.crm.interfaces.dto.response.customer.CustomerRankResponse;
import com.vti.crm.interfaces.mapper.CustomerRankWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customer-ranks")
@RequiredArgsConstructor
public class CustomerRankController {

    private final GetAllCustomerRanksUseCase useCase;
    private final CustomerRankWebMapper webMapper;

    @GetMapping
    public ResponseEntity<List<CustomerRankResponse>> getAllRanks() {
        List<CustomerRankResponse> responses = useCase.execute().stream()
                .map(webMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }
}