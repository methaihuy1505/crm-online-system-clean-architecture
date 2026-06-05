package com.vti.crm.domain.model;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class UserFilter {
    private String keyword;       // Tìm kiếm: username, email, fullName, phone
    private User.Status status;
    private Integer roleId;
    private List<Integer> branchIds;
    private List<Integer> teamIds;
}