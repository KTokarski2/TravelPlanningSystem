package com.soeztrip.travelplanner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;


@SpringBootApplication
@EnableConfigurationProperties(OpenAIConfigProperties.class)
public class SoezTripApplication {
    public static void main(String[] args) {
        SpringApplication.run(SoezTripApplication.class, args);
    }

}
