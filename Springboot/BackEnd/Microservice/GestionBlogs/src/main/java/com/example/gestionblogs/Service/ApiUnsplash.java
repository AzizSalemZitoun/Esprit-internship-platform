package com.example.gestionblogs.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class ApiUnsplash {

        private static final String UNSPLASH_URL = "https://api.unsplash.com/photos/random?query={query}&client_id={aew_Z__4hLOzViF-N66j_ULtNbVoOqeiUdh2HeRkNIU}";
        private static final String API_KEY = "aew_Z__4hLOzViF-N66j_ULtNbVoOqeiUdh2HeRkNIU"; // MY access key

        public String getRandomImageUrl(String query) {
            RestTemplate restTemplate = new RestTemplate();
            Map<String, Object> response = restTemplate.getForObject(UNSPLASH_URL, Map.class, query, API_KEY);

            if (response != null && response.containsKey("urls")) {
                Map<String, String> urls = (Map<String, String>) response.get("urls");
                return urls.get("regular"); // returns the chosen url image
            }
            return null;
        }
    }


