package com.bakeryshop.backend.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class RegisterRequest {

    private String username;

    // The JSON field "password" will be mapped to this property
    @JsonProperty("password")
    private String Password;


}
