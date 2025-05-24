package com.esprit.GestionUtilisateur.ServiceAPI;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Base64;
import java.util.Map;

@Service
public class CopyleaksService {

    private final WebClient webClient;
    private final String API_KEY = "743af330-9931-450b-95c3-b1a6a4a7a953";  // Remplace par ton API Key
    private final String API_URL = "https://id.copyleaks.com/v3/account/login/api";

    public CopyleaksService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(API_URL).build();
    }

    /**
     * Authentification et récupération du Token d'accès.
     */
    public String getAccessToken() {
        Map<String, String> requestBody = Map.of(
                "email", "Aziz.Chahlaoui@esprit.tn",
                "key", API_KEY
        );

        return webClient.post()
                .uri("")
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> response.get("access_token").toString())
                .block();  // Récupère la réponse synchronement
    }


    public String submitPlagiarismCheck(String text) {
        String accessToken = getAccessToken();
        String base64Text = Base64.getEncoder().encodeToString(text.getBytes());

        Map<String, Object> requestBody = Map.of(
                "base64", base64Text,
                "filename", "test.txt",
                "properties", Map.of(
                        "webhooks", Map.of(
                                "status", "http://localhost:8088/plagiarism/callback",
                                "result", "http://localhost:8088/plagiarism/callback"
                        )
                )
        );

        String submitUrl = "https://api.copyleaks.com/v3/scans/submit";

        return webClient.post()
                .uri(submitUrl)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();  // Récupère la réponse synchronement
    }
}