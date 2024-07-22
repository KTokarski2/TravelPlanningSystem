package com.soeztrip.travelplanner.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.soeztrip.travelplanner.dto.WeatherDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {

    private final RestTemplate restTemplate;
    private final String apiKey;
    @Value("${weather.api.url}")
    private String API;

    public WeatherService(RestTemplate restTemplate, @Value("${weather.api.key}") String apiKey) {
        this.restTemplate = restTemplate;
        this.apiKey = apiKey;
    }

    public WeatherDTO getWeatherForCity(String city) {
        String url = API + city + "&appid=" + apiKey;
        System.out.println(url);
        try {
            String response = restTemplate.getForObject(url, String.class);
            if (response != null) {
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode rootNode = objectMapper.readTree(response);

                double temperature = extractTemperatureFromWeatherData(rootNode);
                String weatherDescription = extractWeatherDescriptionFromWeatherData(rootNode);

                if (temperature != Double.NaN && weatherDescription != null) {
                    WeatherDTO weather = new WeatherDTO();
                    weather.setCity(city);
                    weather.setTemperature(temperature);
                    weather.setDescription(weatherDescription);
                    return weather;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    private int extractTemperatureFromWeatherData(JsonNode rootNode) {
        JsonNode mainNode = rootNode.get("main");
        if (mainNode != null) {
            JsonNode temperatureNode = mainNode.get("temp");
            if (temperatureNode != null) {
                double temperatureKelvin = temperatureNode.asDouble();
                int temperatureCelsius = (int) Math.round(temperatureKelvin - 273.15);
                return temperatureCelsius;
            }
        }
        return Integer.MIN_VALUE;
    }

    private String extractWeatherDescriptionFromWeatherData(JsonNode rootNode) {
        JsonNode weatherArrayNode = rootNode.get("weather");
        if (weatherArrayNode != null && weatherArrayNode.isArray() && weatherArrayNode.size() > 0) {
            JsonNode weatherNode = weatherArrayNode.get(0);
            JsonNode descriptionNode = weatherNode.get("description");
            if (descriptionNode != null) {
                return descriptionNode.asText();
            }
        }
        return null;
    }
}