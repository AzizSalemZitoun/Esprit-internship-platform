package com.esprit.GestionUtilisateur.Controller;


import com.esprit.GestionUtilisateur.DTO.ForgotPasswordRequest;
import com.esprit.GestionUtilisateur.DTO.LoginRequest;
import com.esprit.GestionUtilisateur.DTO.PasswordResetRequest;
import com.esprit.GestionUtilisateur.DTO.UserSignupRequest;
import com.esprit.GestionUtilisateur.Entities.User;
import com.esprit.GestionUtilisateur.Repository.UserRepository;
import com.esprit.GestionUtilisateur.Service.UserService;
import com.esprit.GestionUtilisateur.ServiceAPI.CaptchaService;
import com.esprit.GestionUtilisateur.ServiceAPI.EmailService;
import com.esprit.GestionUtilisateur.ServiceAPI.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Collections;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;  // Ajout de l'injection de PasswordEncoder
    private final CaptchaService captchaService;




    public AuthController(UserService userService, UserRepository userRepository, EmailService emailService, JwtService jwtService, PasswordEncoder passwordEncoder, CaptchaService captchaService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.captchaService = captchaService;
    }

    // Endpoint pour l'inscription
    // Endpoint pour l'inscription
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody UserSignupRequest request) {
        // Validation des champs obligatoires
        if (request.getNom() == null || request.getPrenom() == null || request.getEmail() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Les champs obligatoires doivent être remplis."));
        }

        User user = new User();
        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setCompetences(request.getCompetences()); // Ajout des compétences
        user.setRole(request.getRole());

        try {
            User registeredUser = userService.register(user);
            return ResponseEntity.ok(registeredUser);
        } catch (ResponseStatusException e) {
            // Capture l'erreur si l'email est déjà utilisé
            return ResponseEntity.status(e.getStatusCode()).body(Collections.singletonMap("error", e.getReason()));
        } catch (Exception e) {
            // Gestion d'erreur générique
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "Une erreur interne est survenue."));
        }
    }




    // Endpoint pour la connexion
   /* @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody LoginRequest loginRequest) {
        try {
            String token = userService.login(loginRequest.getEmail(), loginRequest.getPassword());

            // Renvoyer le token dans une réponse JSON
            return ResponseEntity.ok(Collections.singletonMap("token", token)); // Utilisation d'une map pour inclure le token dans une structure JSON

        } catch (ResponseStatusException e) {
            // Gérer l'erreur en capturant le message et en renvoyant une réponse appropriée
            return ResponseEntity.status(e.getStatusCode()).body(Collections.singletonMap("error", e.getReason()));
        } catch (Exception e) {
            // Capturer les erreurs générales
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "Une erreur interne est survenue."));
        }
    }*/

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody LoginRequest loginRequest) {
        try {
            // Vérifier le token CAPTCHA
            boolean isCaptchaValid = captchaService.verifyCaptcha(loginRequest.getCaptchaToken());

            if (!isCaptchaValid) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Collections.singletonMap("error", "Le CAPTCHA n'est pas valide."));
            }

            // Si le CAPTCHA est valide, procéder au login
            String token = userService.login(loginRequest.getEmail(), loginRequest.getPassword());

            // Renvoyer le token dans une réponse JSON
            return ResponseEntity.ok(Collections.singletonMap("token", token));

        } catch (ResponseStatusException e) {
            // Gérer l'erreur en capturant le message et en renvoyant une réponse appropriée
            return ResponseEntity.status(e.getStatusCode()).body(Collections.singletonMap("error", e.getReason()));
        } catch (Exception e) {
            // Capturer les erreurs générales
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "Une erreur interne est survenue."));
        }
    }



    /*PostMapping("/face-recognition")
    public ResponseEntity<?> recognizeWithFace() {
        try {
            // Appeler l'API Python FastAPI
            URL url = new URL("http://localhost:8000/recognize");
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");
            con.setConnectTimeout(10000); // 10s timeout
            con.setReadTimeout(30000); // 30s max attente caméra
            con.setDoOutput(true);

            int status = con.getResponseCode();

            BufferedReader in = new BufferedReader(new InputStreamReader(
                    status >= 200 && status < 300 ? con.getInputStream() : con.getErrorStream()));
            String inputLine;
            StringBuilder responseContent = new StringBuilder();

            while ((inputLine = in.readLine()) != null) {
                responseContent.append(inputLine);
            }
            in.close();
            con.disconnect();

            // Renvoyer directement la réponse de l’API Python à l’appelant Spring
            return ResponseEntity.status(status).body(responseContent.toString());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur de communication avec le service de reconnaissance faciale");
        }
    }*/


   /* @PostMapping("/signin-face")
    public ResponseEntity<?> signinWithFace() {
        try {
            // Commande pour exécuter ton script
            ProcessBuilder pb = new ProcessBuilder("python3", "C:\\Users\\azizc\\Untitled.py");
            pb.redirectErrorStream(true);  // Pour récupérer aussi les erreurs

            Process process = pb.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

            String line;
            StringBuilder output = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }

            int exitCode = process.waitFor();

            String result = output.toString().trim();
            if (exitCode != 0 || result.equals("NOT_FOUND")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", "Aucun visage reconnu."));
            }

            // Récupérer l'utilisateur avec l'ID retourné
            Long userId = Long.parseLong(result);
            Optional<User> optionalUser = userRepository.findById(userId);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", "Utilisateur introuvable."));
            }

            User user = optionalUser.get();
            String token = jwtService.generateToken(user);  // Génère le JWT

            return ResponseEntity.ok(Collections.singletonMap("token", token));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "Erreur lors de la reconnaissance faciale."));
        }
    }*/



    /*@PostMapping("/face-login")
    public ResponseEntity<?> faceLogin() {
        try {
            // Chemin vers le script Python adapté (non interactif)
            ProcessBuilder pb = new ProcessBuilder("python", "C:\\Users\\azizc\\Untitled.py");
            pb.redirectErrorStream(true);  // Combiner stdout et stderr
            Process process = pb.start();

            // Lecture de la sortie du script
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String userId = reader.readLine();

            // Attendre la fin du processus et récupérer le code de sortie
            int exitCode = process.waitFor();

            if (exitCode == 0 && userId != null && !userId.trim().isEmpty()) {
                Optional<User> userOpt = userRepository.findById(Long.parseLong(userId.trim()));
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    String token = jwtService.generateToken(user);
                    return ResponseEntity.ok(Collections.singletonMap("token", token));
                } else {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(Collections.singletonMap("error", "Utilisateur non trouvé"));
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Collections.singletonMap("error", "Visage non reconnu"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Erreur serveur"));
        }
    }*/



    // Endpoint pour vérifier l'utilisateur via un lien contenant un token
    @GetMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestParam String token) {
        try {
            userService.verifyUser(token); // Appel au service pour gérer la logique de vérification
            return ResponseEntity.ok("Votre e-mail a été vérifié avec succès !");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        String email = request.getEmail(); // On récupère l'email de l'objet envoyé

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            emailService.sendPasswordResetEmail(user); // Envoi de l'email de réinitialisation
            return ResponseEntity.ok(Collections.singletonMap("message", "Un lien de réinitialisation a été envoyé à votre adresse email."));
        }
        return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Aucun utilisateur trouvé avec cet email."));
    }


    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestBody PasswordResetRequest request) {
        String newPassword = request.getNewPassword();

        try {
            String email = jwtService.extractUsername(token); // Extraction de l'email du token
            Optional<User> userOptional = userRepository.findByEmail(email);

            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Utilisateur introuvable.");
            }

            User user = userOptional.get();

            // Vérifier si le token est expiré (ajoute cette méthode dans JwtService si nécessaire)
            if (jwtService.isTokenExpired(token)) {
                return ResponseEntity.badRequest().body("Le lien de réinitialisation du mot de passe a expiré.");
            }

            user.setPassword(passwordEncoder.encode(newPassword)); // Encodage du nouveau mot de passe
            userRepository.save(user); // Sauvegarde du mot de passe réinitialisé

            return ResponseEntity.ok("Votre mot de passe a été réinitialisé avec succès.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Token invalide ou erreur interne.");
        }
    }



}
