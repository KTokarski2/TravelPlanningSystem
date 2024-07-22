package com.soeztrip.travelplanner;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("openai")
public record OpenAIConfigProperties( String OPENAI_API_KEY, String OPENAI_API_URL) {
}
