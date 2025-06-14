package com.danang_auction.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dqxejjuwq",
                "api_key", "367541964492149",
                "api_secret", "ULKv9nWm3e5_UU6X3cf0maS-jzY",
                "secure", true
        ));
    }
}
