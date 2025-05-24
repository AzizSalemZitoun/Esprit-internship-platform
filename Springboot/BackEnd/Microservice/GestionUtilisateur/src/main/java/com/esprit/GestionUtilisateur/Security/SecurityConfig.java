package com.esprit.GestionUtilisateur.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(CustomUserDetailsService userDetailsService, JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                          // All other requests must be authenticated

                        .requestMatchers("/api/auth/**","/plagiarism/**","/uploads/**","/api/candidatures/**","/api/documents/**","/api/chat/**","/offres/**","/entreprise/**").permitAll()
                        .requestMatchers("/api/users/get").hasRole("ADMIN")  // Autorisation uniquement pour les utilisateurs avec le rôle ADMIN
                        .requestMatchers("/api/users/accept/{userId}").hasAnyRole("ADMIN", "USER")
                        .requestMatchers("/api/users/block/{userId}").hasRole("ADMIN")
                        .requestMatchers("/api/stage/uploadFile").hasRole("ETUDIANT")
                        .requestMatchers("/api/stage/lettre/{id}").hasRole("ETUDIANT")
                        .requestMatchers("/api/stage/getStages").hasRole("ADMIN")
                        .requestMatchers("/api/users/profile").hasAnyRole("ETUDIANT","ADMIN")
                        .requestMatchers("/api/stage/downloadJournal").hasRole("ETUDIANT")
                        .requestMatchers("/api/stage/demande-stage/{id}").hasRole("ETUDIANT")
                        .requestMatchers("/api/stage/user").hasRole("ETUDIANT")
                        .requestMatchers("/api/stage/file/{id}").hasRole("ADMIN")
                        .requestMatchers("/api/stage/download/{id}").hasRole("ADMIN")
                        .requestMatchers("/api/users/upload-profile-picture/{userId}").hasAnyRole("ETUDIANT","ADMIN")
                        .requestMatchers("/api/reclamations/**").hasAnyRole("ADMIN", "USER")







                        // Ajout des règles pour les méthodes de stage
                        /*.requestMatchers("/api/stages/create/**").permitAll()  // Autoriser l'accès sans authentification
                        .requestMatchers("/api/stages/{stageId}/upload").hasRole("ADMIN") */ // Autorise ADMIN seulement

                        /*.requestMatchers("/api/stages/update/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers("/api/stages/delete/**").hasRole("ADMIN")
                        .requestMatchers("/api/stages/user/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers("/api/stages/upload/journal/**").hasRole("ADMIN")*/



                        .anyRequest().authenticated()

                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .cors(customizer -> customizer.configurationSource(corsConfigurationSource())); // Ensure CORS config is applied

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // CORS Configuration - Allow frontend to interact with the backend API
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.addAllowedOriginPattern("*");  // Frontend Angular
        configuration.addAllowedMethod("GET");
        configuration.addAllowedMethod("POST");
        configuration.addAllowedMethod("PUT");
        configuration.addAllowedMethod("DELETE");
        configuration.addAllowedMethod("OPTIONS");  // Allow OPTIONS for preflight CORS requests
        configuration.addAllowedHeader("*"); // Allow all headers
        configuration.setAllowCredentials(true);  // Allow cookies and credentials

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);  // Apply to all URLs
        return source;
    }
}
