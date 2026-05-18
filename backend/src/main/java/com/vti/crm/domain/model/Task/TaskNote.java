package com.vti.crm.domain.model.Task;

import lombok.Data;

import java.time.LocalDateTime;
@Data
public class TaskNote {
    private Integer id;
    private Integer taskId;
    private Integer userId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime deletedAt;
    private LocalDateTime updateAt;

    public void initializeForCreation()
    {
        validation();
        this.createdAt = LocalDateTime.now();
    }
    public void updateForm(TaskNote newData)
    {
        validation();
        if(this.deletedAt!=null)
            throw new IllegalArgumentException("Đối tượng này đã bị xóa mềm");
        this.content = newData.getContent();

        this.updateAt = LocalDateTime.now();
    }
    public void validation()
    {
        if(this.taskId==null)
            throw new IllegalArgumentException("TaskId không được rỗng");
        if(this.userId==null)
            throw new IllegalArgumentException("UserId không được rỗng");
        if(this.content==null)
            throw new IllegalArgumentException("Content không được rỗng");
    }
}
