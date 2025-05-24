package com.esprit.GestionUtilisateur.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class    WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/profile_pictures/**")
                .addResourceLocations("file:" + System.getProperty("user.dir") + "/uploads/profile_pictures/");
        // 🔹 Utilisation du chemin absolu
    }
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

