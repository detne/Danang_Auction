package com.danang_auction.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;

public class DotenvInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {
    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        Dotenv dotenv = Dotenv.load();
        Map<String, Object> envVars = new HashMap<>();

        dotenv.entries().forEach(entry -> envVars.put(entry.getKey(), entry.getValue()));
        applicationContext.getEnvironment().getPropertySources().addFirst(new MapPropertySource("dotenv", envVars));
    }
}
