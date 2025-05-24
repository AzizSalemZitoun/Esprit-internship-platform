package com.esprit.GestionUtilisateur.Controller;
import com.esprit.GestionUtilisateur.Entities.Candidature;
import com.esprit.GestionUtilisateur.Entities.Offre;
import com.esprit.GestionUtilisateur.Entities.User;
import com.esprit.GestionUtilisateur.Repository.OffreRepository;
import com.esprit.GestionUtilisateur.Repository.UserRepository;
import com.esprit.GestionUtilisateur.Service.CandidatureService;
import com.esprit.GestionUtilisateur.ServiceAPI.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/candidatures")
@CrossOrigin(origins = "http://localhost:4200")
public class CandidatureController {
    private final CandidatureService candidatureService;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    @Autowired
    OffreRepository offreRepository;

    public CandidatureController(CandidatureService candidatureService, JwtService jwtService, UserRepository userRepository) {
        this.candidatureService = candidatureService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> createCandidature(
            @Valid @RequestBody Candidature candidature,
            @RequestHeader("Authorization") String token) {
        try {
            // Extraire l'email du token JWT
            String userEmail = jwtService.extractUsername(token.replace("Bearer ", ""));
            System.out.println("User email extracted: " + userEmail);

            // Récupérer l'utilisateur connecté
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
            System.out.println("User found: " + user.getEmail());

            // Associer l'utilisateur à la candidature
            candidature.setUser(user);
            candidature.setStudentId(user.getId()); // Très important ici

            // Enregistrer la candidature
            Candidature saved = candidatureService.createCandidature(candidature);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace();  // Afficher l'exception dans les logs
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la création de la candidature : " + e.getMessage());
        }
    }


    @GetMapping
    public ResponseEntity<List<Candidature>> getAllCandidatures() {
        return ResponseEntity.ok(candidatureService.getAllCandidatures());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Candidature> getCandidature(@PathVariable int id) {
        return ResponseEntity.ok(candidatureService.getCandidatureById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Candidature> updateStatus(
            @PathVariable int id,
            @RequestParam String newStatus
    ) {
        return ResponseEntity.ok(candidatureService.updateCandidatureStatus(id, newStatus));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCandidature(@PathVariable int id) {
        candidatureService.deleteCandidature(id);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/postuler/{offreId}")
    public ResponseEntity<?> postuler(@PathVariable Long offreId) {
        // Fetch the offer by ID
        Offre offre = offreRepository.findById(offreId)
                .orElseThrow(() -> new RuntimeException("Offre not found"));

        // Create a new candidature linked to the offer
        Candidature candidature = new Candidature();
        candidature.setOffre(offre);  // Set the offer to the candidature

        // Save the candidature via service layer
        candidatureService.createCandidature(candidature);

        return ResponseEntity.ok("Candidature envoyée !");
    }
}

