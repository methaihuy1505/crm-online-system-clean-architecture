package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.team.*;
import com.vti.crm.interfaces.dto.request.team.TeamCreateRequest;
import com.vti.crm.interfaces.dto.response.team.TeamResponse;
import com.vti.crm.interfaces.mapper.TeamWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/teams")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('teams.view')")
public class TeamController {

    private final CreateTeamUseCase createTeamUseCase;
    private final GetAllTeamsUseCase getAllTeamsUseCase;
    private final GetTeamByIdUseCase getTeamByIdUseCase;
    private final UpdateTeamUseCase updateTeamUseCase;
    private final DeleteTeamUseCase deleteTeamUseCase;
    private final TeamWebMapper webMapper;

    @PostMapping
    @PreAuthorize("hasAuthority('teams.create')")
    public ResponseEntity<TeamResponse> createTeam(@RequestBody TeamCreateRequest request) {
        return new ResponseEntity<>(webMapper.toResponse(createTeamUseCase.execute(request)), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Page<TeamResponse>> getAllTeams(Pageable pageable) {
        return ResponseEntity.ok(getAllTeamsUseCase.execute(pageable).map(webMapper::toResponse));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeamResponse> getTeamById(@PathVariable Integer id) {
        return ResponseEntity.ok(webMapper.toResponse(getTeamByIdUseCase.execute(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('teams.update')")
    public ResponseEntity<TeamResponse> updateTeam(@PathVariable Integer id, @RequestBody TeamCreateRequest request) {
        return ResponseEntity.ok(webMapper.toResponse(updateTeamUseCase.execute(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('teams.delete')")
    public ResponseEntity<Void> deleteTeam(@PathVariable Integer id) {
        deleteTeamUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}