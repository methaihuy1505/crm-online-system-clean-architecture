package com.vti.crm.interfaces.rest;

import com.vti.crm.application.usecases.task.tasknote.CreateTaskNoteUseCase;
import com.vti.crm.application.usecases.task.tasknote.DeleteTaskNoteUseCase;
import com.vti.crm.application.usecases.task.tasknote.GetTaskNoteUseCase;
import com.vti.crm.application.usecases.task.tasknote.UpdateTaskNoteUseCase;
import com.vti.crm.domain.model.PagedResult;
import com.vti.crm.domain.model.TaskNote;
import com.vti.crm.interfaces.dto.request.task.TaskNoteCreationRequest;
import com.vti.crm.interfaces.dto.request.task.TaskNoteUpdateRequest;
import com.vti.crm.interfaces.dto.response.task.TaskNoteReponseDTO;
import com.vti.crm.interfaces.mapper.TaskNoteWebMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/task-notes")
@RequiredArgsConstructor
public class TaskNoteController {
    private final GetTaskNoteUseCase getTaskNoteUseCase;
    private final UpdateTaskNoteUseCase updateTaskNoteUseCase;
    private final DeleteTaskNoteUseCase deleteTaskNoteUseCase;
    private final CreateTaskNoteUseCase createTaskNoteUseCase;
    
    private final TaskNoteWebMapper mapper;

    @GetMapping
    PagedResult<TaskNoteReponseDTO> getAllTaskNotes(@RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "10") int size)
    {
        PagedResult<TaskNote> taskNotes = getTaskNoteUseCase.excuteGetAll(page, size);
        return mapper.toResponseList(taskNotes);
    }
    @GetMapping("/{id}")
    public TaskNoteReponseDTO getActivityById(@PathVariable Integer id) {
        TaskNote taskNotes = getTaskNoteUseCase.excuteGetById(id);
        return mapper.toResponse(taskNotes);
    }
    @PostMapping("/id")
    public TaskNoteReponseDTO createTask(@RequestBody TaskNoteCreationRequest request,
                                      @PathVariable Integer id)
    {
        TaskNote taskNote = mapper.toDomainCreate(request);
        TaskNote createdTaskNote = createTaskNoteUseCase.execute(taskNote);
        return mapper.toResponse(createdTaskNote);
    }
    @PutMapping("/{id}")
    public TaskNoteReponseDTO updateTask(@PathVariable Integer id, @RequestBody TaskNoteUpdateRequest request)
    {
        TaskNote taskNote = mapper.toDomainUpdate(request);
        TaskNote updatedTaskNote = updateTaskNoteUseCase.execute(id, taskNote);
        return mapper.toResponse(updatedTaskNote);
    }
    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Integer id) {
        deleteTaskNoteUseCase.excute(id);
        return "Delete completed";
    }
}
