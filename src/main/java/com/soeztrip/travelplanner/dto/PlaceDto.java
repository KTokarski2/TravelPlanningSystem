package com.soeztrip.travelplanner.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;


import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PlaceDto {

    private Long id;
    private String name;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date arrive;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date leave;
    private String prompt;
    private String country;
    private List<TicketDto> tickets;

}
