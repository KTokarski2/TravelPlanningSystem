package com.soeztrip.travelplanner.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProfileStatsDto {

    private int trips;
    private int places;
    private int friends;
}
