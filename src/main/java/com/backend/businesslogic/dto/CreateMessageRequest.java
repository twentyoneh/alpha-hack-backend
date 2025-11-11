package com.backend.businesslogic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CreateMessageRequest {
    @NotNull(message = "Session ID is required")
    private Long sessionId;

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(user|assistant)$", message = "Role must be 'user' or 'assistant'")
    private String role;

    @NotBlank(message = "Content is required")
    private String content;
}
