package com.soeztrip.travelplanner.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDataDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
}
