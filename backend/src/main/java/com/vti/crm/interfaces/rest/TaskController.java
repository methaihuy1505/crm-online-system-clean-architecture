package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.task.CreateTaskUseCase;
import com.vti.crm.application.usecases.task.DeleteTaskUseCase;
import com.vti.crm.application.usecases.task.GetTaskUseCase;
import com.vti.crm.application.usecases.task.UpdateTaskUseCase;
import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.domain.model.Task;
import com.vti.crm.interfaces.dto.request.task.TaskAdvancedSearchRequest;
import com.vti.crm.interfaces.dto.request.task.TaskCreationRequest;
import com.vti.crm.interfaces.dto.request.task.TaskUpdateRequest;
import com.vti.crm.interfaces.dto.response.task.TaskDetailsResponseDTO;
import com.vti.crm.interfaces.dto.response.task.TaskResponseDTO;
import com.vti.crm.interfaces.mapper.TaskWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final GetTaskUseCase getTaskUseCase;
    private final CreateTaskUseCase createTaskUseCase;
    private final UpdateTaskUseCase updateTaskUseCase;
    private final DeleteTaskUseCase deleteTaskUseCase;

    private final TaskWebMapper mapper;

    @GetMapping
    public PagedResult<TaskDetailsResponseDTO> getAllTask(@RequestParam(defaultValue = "0") int page,
                                                          @RequestParam(defaultValue = "10") int size) {
        return getTaskUseCase.excuteGetAll(page, size);
    }

    @GetMapping("/{id}")
    public TaskDetailsResponseDTO getTaskById(@PathVariable Integer id) {
        return getTaskUseCase.excuteGetById(id);
    }

    @GetMapping("/advanced-search")
    public PagedResult<TaskDetailsResponseDTO> advancedSearch(
            @ModelAttribute TaskAdvancedSearchRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return getTaskUseCase.executeAdvancedSearch(request, page, size);
    }

    @PostMapping
    public TaskResponseDTO createTask(@RequestBody TaskCreationRequest request) {
        Task taskToCreate = mapper.toDomainCreate(request);
        Task createdTask = createTaskUseCase.execute(taskToCreate);
        return mapper.toResponse(createdTask);
    }

    @PutMapping("/{id}")
    public TaskResponseDTO updateTask(@PathVariable Integer id, @RequestBody TaskUpdateRequest request) {
        Task taskToUpdate = mapper.toDomainUpdate(request);
        Task updatedTask = updateTaskUseCase.execute(id, taskToUpdate);
        return mapper.toResponse(updatedTask);
    }

    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Integer id) {
        deleteTaskUseCase.excute(id);
        return "Delete completed";
    }
}