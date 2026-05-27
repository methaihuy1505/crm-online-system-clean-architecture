package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.province.*;
import com.vti.crm.interfaces.dto.request.province.ProvinceRequest;
import com.vti.crm.interfaces.dto.response.province.ProvinceResponse;
import com.vti.crm.interfaces.mapper.ProvinceWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/provinces")
@RequiredArgsConstructor
public class ProvinceController {

    private final CreateProvinceUseCase createProvinceUseCase;
    private final GetAllProvincesUseCase getAllProvincesUseCase;
    private final GetProvinceByIdUseCase getProvinceByIdUseCase;
    private final UpdateProvinceUseCase updateProvinceUseCase;
    private final DeleteProvinceUseCase deleteProvinceUseCase;
    private final ProvinceWebMapper webMapper;

    @PostMapping
    public ResponseEntity<ProvinceResponse> createProvince(@RequestBody ProvinceRequest request) {
        return new ResponseEntity<>(webMapper.toResponse(createProvinceUseCase.execute(request)), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ProvinceResponse>> getAllProvinces() {
        List<ProvinceResponse> response = getAllProvincesUseCase.execute().stream()
                .map(webMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProvinceResponse> getProvinceById(@PathVariable Integer id) {
        return ResponseEntity.ok(webMapper.toResponse(getProvinceByIdUseCase.execute(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProvinceResponse> updateProvince(@PathVariable Integer id, @RequestBody ProvinceRequest request) {
        return ResponseEntity.ok(webMapper.toResponse(updateProvinceUseCase.execute(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProvince(@PathVariable Integer id) {
        deleteProvinceUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}