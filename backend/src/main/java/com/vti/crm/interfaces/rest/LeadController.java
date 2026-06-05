package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.lead.*;
import com.vti.crm.infrastructure.security.CustomUserDetails;
import com.vti.crm.interfaces.dto.request.lead.LeadCreateRequest;
import com.vti.crm.interfaces.dto.request.lead.LeadUpdateRequest;
import com.vti.crm.interfaces.dto.response.lead.LeadResponse;
import com.vti.crm.interfaces.mapper.LeadWebMapper;
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
@RequestMapping("/api/v1/leads")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('leads.view')")
public class LeadController {

    private final CreateLeadUseCase createLeadUseCase;
    private final GetAllLeadsUseCase getAllLeadsUseCase;
    private final GetLeadByIdUseCase getLeadByIdUseCase;
    private final UpdateLeadUseCase updateLeadUseCase;
    private final DeleteLeadUseCase deleteLeadUseCase;
    private final ConvertLeadUseCase convertLeadUseCase;
    private final LeadWebMapper webMapper;

    @PostMapping
    @PreAuthorize("hasAuthority('leads.create')")
    public ResponseEntity<LeadResponse> createLead(
            @Valid @RequestBody LeadCreateRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) { // Bơm thông tin user

        Integer currentUserId = currentUser.getId();

        LeadResponse response = webMapper.toResponse(createLeadUseCase.execute(request, currentUserId));
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<LeadResponse>> getAllLeads(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) List<Integer> statusIds,
            @RequestParam(required = false) List<Integer> sourceIds,
            @RequestParam(required = false) List<Integer> campaignIds,
            @RequestParam(required = false) Integer provinceId,
            @RequestParam(required = false) Integer branchId,
            Pageable pageable,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        Integer currentUserId = currentUser.getId();
        Integer roleId = currentUser.getRoleId();

        Page<LeadResponse> leads = getAllLeadsUseCase.execute(
                keyword, statusIds, sourceIds, campaignIds, provinceId, branchId, pageable,
                currentUserId, roleId
        ).map(webMapper::toResponse);
        return ResponseEntity.ok(leads);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadResponse> getLeadById(
            @PathVariable Integer id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {

        Integer currentUserId = currentUser.getId();
        Integer roleId = currentUser.getRoleId();

        LeadResponse response = webMapper.toResponse(getLeadByIdUseCase.execute(id, currentUserId, roleId));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('leads.update')")
    public ResponseEntity<LeadResponse> updateLead(
            @PathVariable Integer id,
            @Valid @RequestBody LeadUpdateRequest request,
            @AuthenticationPrincipal CustomUserDetails currentUser) {

        Integer currentUserId = currentUser.getId();

        LeadResponse response = webMapper.toResponse(updateLeadUseCase.execute(id, request, currentUserId));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('leads.delete')")
    public ResponseEntity<Void> deleteLead(
            @PathVariable Integer id,
            @AuthenticationPrincipal CustomUserDetails currentUser) {

        Integer currentUserId = currentUser.getId();

        deleteLeadUseCase.execute(id, currentUserId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/convert")
    @PreAuthorize("hasAuthority('leads.convert')") // Chặn quyền từ cấu hình bảo mật hệ thống
    public ResponseEntity<String> convertLead(
            @PathVariable Integer id,
            @AuthenticationPrincipal CustomUserDetails currentUser) { // Lấy thông tin user đăng nhập từ JWT Token

        Integer currentUserId = currentUser.getId();

        // Thực thi nghiệp vụ chuyển đổi dữ liệu liên kết bảng
        convertLeadUseCase.execute(id, currentUserId);

        return ResponseEntity.ok("Chuyển đổi Khách hàng tiềm năng sang Khách hàng chính thức thành công!");
    }
}