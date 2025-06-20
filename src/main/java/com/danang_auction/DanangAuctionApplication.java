package com.danang_auction;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.ConfigurableEnvironment;

@SpringBootApplication
public class DanangAuctionApplication {

    public static void main(String[] args) {
        // 🟢 Load .env trước khi Spring Boot start
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        ConfigurableEnvironment environment = SpringApplication.run(DanangAuctionApplication.class, args).getEnvironment();
        dotenv.entries().forEach(entry ->
                environment.getSystemProperties().put(entry.getKey(), entry.getValue())
        );
    }
}