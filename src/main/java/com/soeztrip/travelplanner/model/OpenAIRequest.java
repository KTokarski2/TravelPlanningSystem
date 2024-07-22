package com.soeztrip.travelplanner.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;


@Data
public class OpenAIRequest {

    private String model = "gpt-3.5-turbo";
    private List<OpenAIMessage> messages;

    public OpenAIRequest(String prompt) {
        this.messages = new ArrayList<>();
        this.messages.add(new OpenAIMessage("user", prompt));
    }
}
