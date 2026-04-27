package com.vti.crm.domain.model;

public class ImageFileData {
    private final byte[] content;
    private final String contentType;
    private final String fileName;

    public ImageFileData(byte[] content, String contentType, String fileName) {
        this.content = content;
        this.contentType = contentType;
        this.fileName = fileName;
    }

    public byte[] getContent() { return content; }
    public String getContentType() { return contentType; }
    public String getFileName() { return fileName; }
}