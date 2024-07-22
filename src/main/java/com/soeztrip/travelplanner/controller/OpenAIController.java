package com.soeztrip.travelplanner.controller;

import com.soeztrip.travelplanner.dto.SearchRequestDto;
import com.soeztrip.travelplanner.service.OpenAIService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping()
@CrossOrigin(origins = "*")
public class OpenAIController {

    private OpenAIService openAIService;

    public OpenAIController(OpenAIService openAIService) {
        this.openAIService = openAIService;
    }

    @PostMapping("/openaiSearch")
    public String getResponse(@RequestBody SearchRequestDto destination) {
        return openAIService.processResponse(destination.getQuery());
    }
}
