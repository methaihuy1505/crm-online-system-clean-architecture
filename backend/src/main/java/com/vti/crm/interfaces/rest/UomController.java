package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.uom.CreateUomUseCase;
import com.vti.crm.application.usecases.uom.GetAllUomUseCase;
import com.vti.crm.application.usecases.uom.UpdateUomUseCase;
import com.vti.crm.interfaces.dto.request.product.UomRequest;
import com.vti.crm.interfaces.dto.response.product.UomResponse;
import com.vti.crm.interfaces.mapper.UomWebMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/uoms")
@RequiredArgsConstructor
public class  UomController {

    private final CreateUomUseCase createUomUseCase;
    private final UpdateUomUseCase updateUomUseCase;
    private final GetAllUomUseCase getAllUomUseCase;
    private final UomWebMapper webMapper;

    @PostMapping
    public ResponseEntity<UomResponse> create(@Valid @RequestBody UomRequest request) {
        // Data flow: Controller -> UseCase (truyền param thuần) -> Mapper -> Client
        var uom = createUomUseCase.execute(request.getCode(), request.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(webMapper.toResponse(uom));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UomResponse> update(
            @PathVariable Integer id,
            @Valid @RequestBody UomRequest request) {

        var uom = updateUomUseCase.execute(
                id,
                request.getCode(),
                request.getName(),
                request.isStatus()
        );
        return ResponseEntity.ok(webMapper.toResponse(uom));
    }

    @GetMapping
    public ResponseEntity<List<UomResponse>> getAll() {
        List<UomResponse> response = getAllUomUseCase.execute().stream()
                .map(webMapper::toResponse)
                .toList();
        return ResponseEntity.ok(response);
    }
}