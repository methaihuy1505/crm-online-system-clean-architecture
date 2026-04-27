package com.vti.crm.domain.repository;

import com.vti.crm.domain.model.ImageFileData;

public interface IFileStorageService {
    String upload(ImageFileData file);
}