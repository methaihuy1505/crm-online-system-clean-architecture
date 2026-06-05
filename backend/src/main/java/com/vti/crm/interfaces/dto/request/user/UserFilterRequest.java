package com.vti.crm.interfaces.dto.request.user;

import com.vti.crm.domain.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserFilterRequest {
    private String keyword;
    private User.Status status;
    private Integer roleId;
    private List<Integer> branchIds;
    private List<Integer> teamIds;
}