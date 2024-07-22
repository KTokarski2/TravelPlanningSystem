package com.soeztrip.travelplanner.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TripDto {

    private Long id;
    private Date startingDate;
    private Date endingDate;
    private Boolean finished;
    private String title;
    private List<PlaceDto> places;
    private List<UserDto> participants;
    private Long chatRoomId;
}
