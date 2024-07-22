package com.soeztrip.travelplanner.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {


    private Long id;

    @NotEmpty(message = "first name can not be empty")
    private String firstName;

    @NotEmpty(message = "last name can not be empty")
    private String lastName;

    @NotEmpty(message = "email can not be empty")
    @Email
    private String email;

    @NotEmpty(message = "password can not be empty")
    private String password;

    private String profilePicturePath;

    private String role;

}
