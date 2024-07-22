package com.soeztrip.travelplanner.config;

import com.soeztrip.travelplanner.service.WeatherService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Value("${weather.api.key}")
    private String apiKey;

    @Bean
    public WeatherService myWeatherService(RestTemplate restTemplate, @Value("${weather.api.key}") String apiKey) {
        return new WeatherService(restTemplate, apiKey);
    }

}
