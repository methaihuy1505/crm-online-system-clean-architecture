package com.vti.crm.domain.model;

import java.util.List;

public class OpportunityFilter {
    private final String search;
    private final List<Integer> stageIds;
    private final List<Integer> statusIds;
    private final List<Integer> reasonIds;
    private final String sort;

    public OpportunityFilter(String search,
                             List<Integer> stageIds,
                             List<Integer> statusIds,
                             List<Integer> reasonIds,
                             String sort) {
        this.search    = search;
        this.stageIds  = stageIds  != null ? stageIds  : List.of();
        this.statusIds = statusIds != null ? statusIds : List.of();
        this.reasonIds = reasonIds != null ? reasonIds : List.of();
        this.sort      = sort;
    }

    public String getSearch()             { return search; }
    public List<Integer> getStageIds()    { return stageIds; }
    public List<Integer> getStatusIds()   { return statusIds; }
    public List<Integer> getReasonIds()   { return reasonIds; }
    public String getSort()               { return sort; }
}