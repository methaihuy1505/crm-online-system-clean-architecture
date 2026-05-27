package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.branch.*;
import com.vti.crm.interfaces.dto.request.branch.BranchRequest;
import com.vti.crm.interfaces.dto.response.branch.BranchResponse;
import com.vti.crm.interfaces.mapper.BranchWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/branches")
@RequiredArgsConstructor
public class BranchController {

    private final CreateBranchUseCase createBranchUseCase;
    private final GetAllBranchesUseCase getAllBranchesUseCase;
    private final GetBranchByIdUseCase getBranchByIdUseCase;
    private final UpdateBranchUseCase updateBranchUseCase;
    private final DeleteBranchUseCase deleteBranchUseCase;
    private final BranchWebMapper webMapper;

    @PostMapping
    public ResponseEntity<BranchResponse> createBranch(@RequestBody BranchRequest request) {
        return new ResponseEntity<>(webMapper.toResponse(createBranchUseCase.execute(request)), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<BranchResponse>> getAllBranches() {
        List<BranchResponse> response = getAllBranchesUseCase.execute().stream()
                .map(webMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BranchResponse> getBranchById(@PathVariable Integer id) {
        return ResponseEntity.ok(webMapper.toResponse(getBranchByIdUseCase.execute(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BranchResponse> updateBranch(@PathVariable Integer id, @RequestBody BranchRequest request) {
        return ResponseEntity.ok(webMapper.toResponse(updateBranchUseCase.execute(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBranch(@PathVariable Integer id) {
        deleteBranchUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}