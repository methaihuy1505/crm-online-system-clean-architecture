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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/task-notes")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('task_notes.view')")
public class TaskNoteController {
    private final GetTaskNoteUseCase getTaskNoteUseCase;
    private final UpdateTaskNoteUseCase updateTaskNoteUseCase;
    private final DeleteTaskNoteUseCase deleteTaskNoteUseCase;
    private final CreateTaskNoteUseCase createTaskNoteUseCase;

    private final TaskNoteWebMapper mapper;

    @GetMapping
    public PagedResult<TaskNoteReponseDTO> getAllTaskNotes(@RequestParam(defaultValue = "0") int page,
                                                           @RequestParam(defaultValue = "10") int size)
    {
        // 🌟 BỎ MAPPER VÌ USECASE ĐÃ XỬ LÝ MAP VÀ ENRICH TÊN RỒI
        return getTaskNoteUseCase.excuteGetAll(page, size);
    }

    @GetMapping("/{id}")
    public TaskNoteReponseDTO getActivityById(@PathVariable Integer id) {
        // 🌟 BỎ MAPPER
        return getTaskNoteUseCase.excuteGetById(id);
    }

    @GetMapping("/task/{taskId}")
    public PagedResult<TaskNoteReponseDTO> getByTaskId(@PathVariable Integer taskId,
                                                       @RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "10") int size) {
        // 🌟 BỎ MAPPER
        return getTaskNoteUseCase.executeGetByTaskId(taskId, page, size);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('task_notes.create')")
    public TaskNoteReponseDTO createTaskNote(@RequestBody TaskNoteCreationRequest request)
    {
        TaskNote taskNote = mapper.toDomainCreate(request);
        TaskNote createdTaskNote = createTaskNoteUseCase.execute(taskNote);
        return mapper.toResponse(createdTaskNote);
        // Lưu ý: Lúc vừa POST xong thì name có thể null, nhưng Frontend của bạn
        // đã gọi hàm fetchNotes() lại ngay lập tức để lấy lại list đầy đủ tên nên không sao.
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('task_notes.update')")
    public TaskNoteReponseDTO updateTaskNote(@PathVariable Integer id, @RequestBody TaskNoteUpdateRequest request)
    {
        TaskNote taskNote = mapper.toDomainUpdate(request);
        TaskNote updatedTaskNote = updateTaskNoteUseCase.execute(id, taskNote);
        return mapper.toResponse(updatedTaskNote);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('task_notes.delete')")
    public String deleteTaskNote(@PathVariable Integer id) {
        deleteTaskNoteUseCase.excute(id);
        return "Delete completed";
    }
}