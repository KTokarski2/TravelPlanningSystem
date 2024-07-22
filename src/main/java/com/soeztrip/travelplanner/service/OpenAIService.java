package com.soeztrip.travelplanner.service;

import com.soeztrip.travelplanner.model.OpenAIRequest;
import com.soeztrip.travelplanner.model.OpenAIResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class OpenAIService {

    @Value("${OPENAI_API_KEY}")
    private String OPENAI_API_KEY;
    @Value("${OPENAI_API_URL}")
    private String OPENAI_API_URL;

    public String processResponse(String destination) {

        String prompt = "Generate a list of the top 5 tourist spots in {query}," +
                " each with a short description. Make sure the spots are diverse," +
                " covering different types of attractions like landmarks, museums, parks, etc.";
        String updatedPrompt = prompt.replace("{query}", destination);

        OpenAIRequest openAIRequest = new OpenAIRequest(updatedPrompt);

        OpenAIResponse openAIResponse =
                restTemplate().postForObject(
                        OPENAI_API_URL,
                        openAIRequest,
                        OpenAIResponse.class);
        return openAIResponse.getChoices().get(0).getMessage().getContent();
    }

    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getInterceptors()
                .add((request, body, execution) -> {
                    request.getHeaders()
                            .add("Authorization", "Bearer "+OPENAI_API_KEY);
                    return execution.execute(request, body);
                });
        return restTemplate;
    }
}
