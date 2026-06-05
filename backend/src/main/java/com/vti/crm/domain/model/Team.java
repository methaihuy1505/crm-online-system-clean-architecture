package com.vti.crm.domain.model;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Team {
    private Integer id;
    private Branch branch; // Quan hệ hướng đối tượng
    private String name;
    private Team parentTeam; // Quan hệ đệ quy
    private String description;
}