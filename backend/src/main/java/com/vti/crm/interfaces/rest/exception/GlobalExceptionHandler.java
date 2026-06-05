package com.vti.crm.interfaces.rest.exception;

import com.vti.crm.interfaces.dto.response.ErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Xử lý lỗi nghiệp vụ (Business Logic Errors)
    // Các lỗi do bạn chủ động throw ra như: Tên đăng nhập trùng, Role đang có người dùng...
    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<ErrorResponse> handleBusinessExceptions(RuntimeException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message(ex.getMessage()) // Trả đúng câu tiếng Việt bạn viết ở UseCase
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    // 2. Xử lý lỗi Validate Form (Từ các annotation @Valid, @NotBlank, @NotNull...)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }

        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Validation Error")
                // Gom tất cả lỗi field lại thành 1 chuỗi, hoặc bạn có thể tạo list lỗi riêng
                .message("Dữ liệu đầu vào không hợp lệ: " + errors.toString())
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    // 3. Xử lý lỗi phân quyền (Security)
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex) {
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.FORBIDDEN.value())
                .error(HttpStatus.FORBIDDEN.getReasonPhrase())
                .message("Bạn không có quyền thực hiện hành động này!")
                .build();
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    // 4.Bắt tất cả các lỗi chưa được lường trước
    // Tránh việc văng chi tiết lỗi DB ra ngoài Frontend
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex) {
        log.error("Lỗi hệ thống không xác định: ", ex); // Vẫn in ra Console để Dev debug

        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                .message("Đã xảy ra lỗi hệ thống, vui lòng thử lại sau!") // Dấu lỗi thật đi
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}