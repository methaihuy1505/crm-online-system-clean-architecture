package com.vti.crm.domain.model;

import lombok.Getter;

@Getter
public class CommunicationDetail {
    private Integer id;
    private Integer parentId;
    private String parentType;
    private String commType;
    private String commValue;
    private String label;
    private Boolean isPrimary;
    private String status;

    public CommunicationDetail(Integer id, Integer parentId, String parentType, String commType, String commValue, String label, Boolean isPrimary, String status) {
        this.id = id;
        this.parentId = parentId;
        this.parentType = parentType;
        this.commType = commType;
        this.commValue = commValue;
        this.label = label;
        this.isPrimary = isPrimary;
        this.status = status;
    }

    public void demoteToSecondary(String newLabel) {
        this.isPrimary = false;
        this.label = newLabel;
    }

    public static CommunicationDetail createNew(Integer parentId, String parentType, String commType, String value, String label, boolean isPrimary) {
        return new CommunicationDetail(null, parentId, parentType, commType, value, label, isPrimary, "ACTIVE");
    }
}