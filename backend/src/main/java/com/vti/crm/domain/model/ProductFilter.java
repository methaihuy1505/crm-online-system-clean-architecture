package com.vti.crm.domain.model;

import java.util.List;

public class ProductFilter {
    private final String search;
    private final List<Integer> categoryIds;
    private final List<Integer> uomIds;
    private final String productType;
    private final String sort;

    public ProductFilter(String search,List<Integer> categoryIds, List<Integer> uomIds,
                         String productType, String sort) {
        this.search = search;
        this.categoryIds = categoryIds != null ? categoryIds : List.of();
        this.uomIds      = uomIds != null ? uomIds : List.of();
        this.productType = productType;
        this.sort        = sort;
    }

    public String getSearch()             { return search; }
    public List<Integer> getCategoryIds() { return categoryIds; }
    public List<Integer> getUomIds()      { return uomIds; }
    public String getProductType()        { return productType; }
    public String getSort()               { return sort; }
}