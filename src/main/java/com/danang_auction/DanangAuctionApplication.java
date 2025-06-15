package com.danang_auction;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DanangAuctionApplication {

    public static void main(String[] args) {
        // 🟢 Load .env trước khi Spring Boot start
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        dotenv.entries().forEach(entry ->
                System.setProperty(entry.getKey(), entry.getValue()));

        SpringApplication.run(DanangAuctionApplication.class, args);
    }
}
