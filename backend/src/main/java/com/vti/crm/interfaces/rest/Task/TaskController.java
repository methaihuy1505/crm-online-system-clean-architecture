package com.vti.crm.interfaces.rest.Task;

import com.vti.crm.application.usecases.task.CreateTaskUseCase;
import com.vti.crm.application.usecases.task.DeleteTaskUseCase;
import com.vti.crm.application.usecases.task.GetTaskUseCase;
import com.vti.crm.application.usecases.task.UpdateTaskUseCase;
import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.domain.model.Task.Task;
import com.vti.crm.interfaces.dto.request.task.TaskCreationRequest;
import com.vti.crm.interfaces.dto.request.task.TaskUpdateRequest;
import com.vti.crm.interfaces.dto.response.task.TaskResponseDTO;
import com.vti.crm.interfaces.mapper.Task.TaskWebMapper;
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

    // Inject MapStruct Mapper
    private final TaskWebMapper mapper;

    @GetMapping
    PagedResult<TaskResponseDTO> getAllTask(@RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "10") int size)
    {
        PagedResult<Task> tasks = getTaskUseCase.excuteGetAll(page, size);
        return mapper.toResponseList(tasks);
    }
    @GetMapping("/{id}")
    public TaskResponseDTO getActivityById(@PathVariable Integer id) {
        Task task = getTaskUseCase.excuteGetById(id);
        return mapper.toResponse(task);
    }
    @PostMapping("/id")
    public TaskResponseDTO createTask(@RequestBody TaskCreationRequest request,
                                      @PathVariable Integer id)
    {
        Task taskToCreate = mapper.toDomainCreate(request);
        Task createdTask = createTaskUseCase.execute(taskToCreate);
        return mapper.toResponse(createdTask);
    }
    @PutMapping("/{id}")
    public TaskResponseDTO updateTask(@PathVariable Integer id, @RequestBody TaskUpdateRequest request)
    {
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
