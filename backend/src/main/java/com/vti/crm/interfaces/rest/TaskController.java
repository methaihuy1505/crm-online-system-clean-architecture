package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.task.CreateTaskUseCase;
import com.vti.crm.application.usecases.task.DeleteTaskUseCase;
import com.vti.crm.application.usecases.task.GetTaskUseCase;
import com.vti.crm.application.usecases.task.UpdateTaskUseCase;
import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.domain.model.Task;
import com.vti.crm.infrastructure.security.CustomUserDetails; // IMPORT class của bạn
import com.vti.crm.interfaces.dto.request.task.TaskAdvancedSearchRequest;
import com.vti.crm.interfaces.dto.request.task.TaskCreationRequest;
import com.vti.crm.interfaces.dto.request.task.TaskUpdateRequest;
import com.vti.crm.interfaces.dto.response.task.TaskDetailsResponseDTO;
import com.vti.crm.interfaces.dto.response.task.TaskResponseDTO;
import com.vti.crm.interfaces.mapper.TaskWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal; // IMPORT annotation
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/tasks")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('tasks.view')")
public class TaskController {
    private final GetTaskUseCase getTaskUseCase;
    private final CreateTaskUseCase createTaskUseCase;
    private final UpdateTaskUseCase updateTaskUseCase;
    private final DeleteTaskUseCase deleteTaskUseCase;

    private final TaskWebMapper mapper;

    @GetMapping
    public PagedResult<TaskDetailsResponseDTO> getAllTask(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @AuthenticationPrincipal CustomUserDetails currentUser) {

        Integer currentUserId = currentUser.getId();
        Integer roleId = currentUser.getRoleId();

        return getTaskUseCase.executeGetAll(page, size, keyword, currentUserId, roleId);
    }

    @GetMapping("/{id}")
    public TaskDetailsResponseDTO getTaskById(@PathVariable Integer id) {

        return getTaskUseCase.excuteGetById(id);
    }

    @GetMapping("/advanced-search")
    @PreAuthorize("hasAuthority('tasks.advanced_search')")
    public PagedResult<TaskDetailsResponseDTO> advancedSearch(
            @ModelAttribute TaskAdvancedSearchRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal CustomUserDetails currentUser) {

        Integer currentUserId = currentUser.getId();
        Integer roleId = currentUser.getRoleId();

        return getTaskUseCase.executeAdvancedSearch(request, page, size, currentUserId, roleId);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('tasks.create')")
    public TaskResponseDTO createTask(@RequestBody TaskCreationRequest request) {
        Task taskToCreate = mapper.toDomainCreate(request);
        Task createdTask = createTaskUseCase.execute(taskToCreate);
        return mapper.toResponse(createdTask);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('tasks.update')")
    public TaskResponseDTO updateTask(@PathVariable Integer id, @RequestBody TaskUpdateRequest request) {
        Task taskToUpdate = mapper.toDomainUpdate(request);
        Task updatedTask = updateTaskUseCase.execute(id, taskToUpdate);
        return mapper.toResponse(updatedTask);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('tasks.delete')")
    public String deleteTask(@PathVariable Integer id) {
        deleteTaskUseCase.excute(id);
        return "Delete completed";
    }
}