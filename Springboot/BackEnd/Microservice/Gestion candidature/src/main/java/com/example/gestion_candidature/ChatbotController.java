package com.example.gestion_candidature;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:4200")
public class ChatbotController {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    private final RestTemplate restTemplate;
    private final String baseUrl = "http://localhost:8080/SpringMVC/";

    public ChatbotController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping
    public ResponseEntity<?> handleChatQuery(@RequestBody Map<String, Object> body) {
        try {
            String userMessage = validateAndExtractMessage(body);
            Optional<String> directResponse = processDatabaseQuery(userMessage);

            return directResponse.isPresent()
                    ? ResponseEntity.ok(createResponse(directResponse.get()))
                    : processGeminiRequest(userMessage);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(createErrorResponse(e.getMessage()));
        }
    }

    private String validateAndExtractMessage(Map<String, Object> body) {
        if (!body.containsKey("message") || body.get("message") == null) {
            throw new IllegalArgumentException("Missing 'message' in request");
        }
        return body.get("message").toString().trim().toLowerCase();
    }

    private Optional<String> processDatabaseQuery(String message) {
        try {
            // Match: list/show all candidatures
            if (message.matches(".*\\b(list|show|display|view)\\b.*\\b(all)?\\s*candidatures?\\b.*")) {
                return Optional.of(getAllCandidatures());
            }

            // Match: details of candidature/application with ID
            if (message.matches(".*\\b(candidature|application)\\b.*\\d+.*")) {
                return handleSingleCandidature(message);
            }

            // Match: documents related to a candidature/application with ID
            if (message.matches(".*\\b(documents?|files?)\\b.*(for|of)?\\s*(candidature|application)?\\s*\\d+.*")) {
                return handleDocumentQuery(message);
            }

            return Optional.empty();
        } catch (Exception e) {
            return Optional.of("An error occurred while retrieving data.");
        }
    }

    private ResponseEntity<?> processGeminiRequest(String userMessage) {
        String context = buildDatabaseContext();
        String prompt = String.format(
                "You are a candidature assistant. Context:\n%s\n\nQuery: %s\n"
                        + "Answer concisely using only the context. If unsure, say you don't know.",
                context, userMessage
        );

        HttpEntity<Map<String, Object>> request = createGeminiRequest(prompt);
        ResponseEntity<String> response = restTemplate.exchange(
                geminiApiUrl + "?key=" + geminiApiKey,
                HttpMethod.POST,
                request,
                String.class
        );

        return ResponseEntity.ok(parseGeminiResponse(response.getBody()));
    }

    private String buildDatabaseContext() {
        StringBuilder context = new StringBuilder();

        context.append("=== Candidatures ===\n");
        context.append(getAllCandidatures());

        context.append("\n\n=== Documents ===\n");
        context.append(getDocumentContext());

        return context.toString();
    }

    private String getAllCandidatures() {
        try {
            ResponseEntity<Candidature[]> response = restTemplate.exchange(
                    baseUrl + "/api/candidatures",
                    HttpMethod.GET,
                    null,
                    Candidature[].class
            );
            return formatCandidatures(response.getBody());
        } catch (Exception e) {
            return "Unable to fetch candidatures.";
        }
    }

    private Optional<String> handleSingleCandidature(String message) {
        Optional<Integer> id = extractId(message);
        if (!id.isPresent()) return Optional.empty();

        try {
            ResponseEntity<Candidature> response = restTemplate.exchange(
                    baseUrl + "/api/candidatures/" + id.get(),
                    HttpMethod.GET,
                    null,
                    Candidature.class
            );
            return Optional.of(formatCandidature(response.getBody()));
        } catch (Exception e) {
            return Optional.of("Candidature not found.");
        }
    }

    private Optional<String> handleDocumentQuery(String message) {
        Optional<Integer> id = extractId(message);
        if (!id.isPresent()) return Optional.empty();

        try {
            ResponseEntity<Document[]> response = restTemplate.exchange(
                    baseUrl + "/api/documents/candidature/" + id.get(),
                    HttpMethod.GET,
                    null,
                    Document[].class
            );
            return Optional.of(formatDocuments(response.getBody()));
        } catch (Exception e) {
            return Optional.of("Documents not found.");
        }
    }

    private String getDocumentContext() {
        try {
            ResponseEntity<Document[]> response = restTemplate.exchange(
                    baseUrl + "/api/documents/all",
                    HttpMethod.GET,
                    null,
                    Document[].class
            );
            return formatDocuments(response.getBody());
        } catch (Exception e) {
            return "Could not retrieve document information.";
        }
    }

    // === Formatters ===
    private String formatCandidatures(Candidature[] candidatures) {
        if (candidatures == null || candidatures.length == 0) return "No candidatures found.";
        StringBuilder sb = new StringBuilder();
        for (Candidature c : candidatures) {
            sb.append(String.format("ID: %d | Status: %s | Date: %s\n",
                    c.getId(), c.getStatut(), c.getDatePostulation()));
        }
        return sb.toString();
    }

    private String formatCandidature(Candidature c) {
        return c != null
                ? String.format(
                "Candidature ID %d\nStatus: %s\nStudent ID: %d\nOffer ID: %d\nDate: %s",
                c.getId(), c.getStatut(), c.getStudentId(), c.getInternshipOfferId(), c.getDatePostulation())
                : "Candidature not found.";
    }

    private String formatDocuments(Document[] documents) {
        if (documents == null || documents.length == 0) return "No documents found.";
        StringBuilder sb = new StringBuilder();
        for (Document d : documents) {
            sb.append(String.format("Document ID: %d | Filename: %s\n",
                    d.getId(), d.getFileName()));
        }
        return sb.toString();
    }

    // === Helpers ===
    private Optional<Integer> extractId(String text) {
        Matcher matcher = Pattern.compile("\\d+").matcher(text);
        return matcher.find()
                ? Optional.of(Integer.parseInt(matcher.group()))
                : Optional.empty();
    }

    private HttpEntity<Map<String, Object>> createGeminiRequest(String prompt) {
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of(
                        "parts", List.of(Map.of("text", prompt))
                ))
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new HttpEntity<>(requestBody, headers);
    }

    private Map<String, Object> createResponse(String text) {
        return Map.of("response", text, "type", "database");
    }

    private Map<String, Object> createErrorResponse(String error) {
        return Map.of("error", error, "type", "error");
    }

    private Map<String, Object> parseGeminiResponse(String response) {
        try {
            Map<String, Object> jsonResponse = new ObjectMapper().readValue(response, Map.class);
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) jsonResponse.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            String text = (String) parts.get(0).get("text");

            return Map.of("response", text, "type", "ai");
        } catch (Exception e) {
            return createErrorResponse("Failed to parse AI response");
        }
    }
}
