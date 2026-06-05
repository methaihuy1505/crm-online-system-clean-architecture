package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.branchprovince.*;
import com.vti.crm.interfaces.dto.request.branchprovince.BranchProvinceRequest;
import com.vti.crm.interfaces.dto.response.branchprovince.BranchProvinceResponse;
import com.vti.crm.interfaces.mapper.BranchProvinceWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/branch-provinces")
@RequiredArgsConstructor
public class BranchProvinceController {

    private final CreateBranchProvinceUseCase createBranchProvinceUseCase;
    private final GetAllBranchProvincesUseCase getAllBranchProvincesUseCase;
    private final GetBranchProvinceByIdUseCase getBranchProvinceByIdUseCase;
    private final UpdateBranchProvinceUseCase updateBranchProvinceUseCase;
    private final DeleteBranchProvinceUseCase deleteBranchProvinceUseCase;
    private final BranchProvinceWebMapper webMapper;

    @PostMapping
    @PreAuthorize("hasAuthority('branches.create')")
    public ResponseEntity<BranchProvinceResponse> createBranchProvince(@RequestBody BranchProvinceRequest request) {
        return new ResponseEntity<>(webMapper.toResponse(createBranchProvinceUseCase.execute(request)), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<BranchProvinceResponse>> getAllBranchProvinces() {
        List<BranchProvinceResponse> response = getAllBranchProvincesUseCase.execute().stream()
                .map(webMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BranchProvinceResponse> getBranchProvinceById(@PathVariable Integer id) {
        return ResponseEntity.ok(webMapper.toResponse(getBranchProvinceByIdUseCase.execute(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('branches.update')")
    public ResponseEntity<BranchProvinceResponse> updateBranchProvince(@PathVariable Integer id, @RequestBody BranchProvinceRequest request) {
        return ResponseEntity.ok(webMapper.toResponse(updateBranchProvinceUseCase.execute(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('branches.delete')")
    public ResponseEntity<Void> deleteBranchProvince(@PathVariable Integer id) {
        deleteBranchProvinceUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}