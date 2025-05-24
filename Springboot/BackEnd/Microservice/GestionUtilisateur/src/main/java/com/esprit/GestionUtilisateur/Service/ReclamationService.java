package com.esprit.GestionUtilisateur.Service;

import com.esprit.GestionUtilisateur.Entities.Reclamation;
import com.esprit.GestionUtilisateur.Entities.User;
import com.esprit.GestionUtilisateur.Repository.ReclamationRepository;
import com.esprit.GestionUtilisateur.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReclamationService {

    @Autowired
    private ReclamationRepository reclamationRepository;
    @Autowired
    private UserRepository userRepository;

    private static final List<String> BAD_WORDS = List.of("mauvaismot1", "mauvaismot2", "mauvaismot3"); // Liste des mots à filtrer

    // Méthode pour remplacer les mots interdits
    private String filterBadWords(String description) {
        for (String badWord : BAD_WORDS) {
            description = description.replaceAll("(?i)" + badWord, "****");
        }
        return description;
    }

    public List<Reclamation> getAllReclamations() {
        return reclamationRepository.findAll();
    }

    public Reclamation getReclamationById(Long id) {
        Optional<Reclamation> reclamation = reclamationRepository.findById(id);
        return reclamation.orElse(null);
    }

    public Reclamation createReclamation(Reclamation reclamation) {
        // Récupérer l'utilisateur connecté
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // Trouver l'utilisateur par son email ou un autre identifiant unique
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Filtrer la description de la réclamation
        String filteredDescription = filterBadWords(reclamation.getDescription());
        reclamation.setDescription(filteredDescription);

        // Associer l'utilisateur à la réclamation
        reclamation.setUser(user);

        // Sauvegarder la réclamation
        return reclamationRepository.save(reclamation);
    }

    public List<Reclamation> getReclamationsByUser() {
        // Récupérer l'utilisateur connecté
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        // Trouver l'utilisateur par son email ou un autre identifiant unique
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Récupérer les réclamations associées à cet utilisateur
        return reclamationRepository.findByUser(user);
    }

    public void deleteReclamation(Long id) {
        reclamationRepository.deleteById(id);
    }

    // Mise à jour d'une réclamation
    public Reclamation saveReclamation(Reclamation reclamation) {
        // Filtrer la description de la réclamation
        String filteredDescription = filterBadWords(reclamation.getDescription());
        reclamation.setDescription(filteredDescription);

        return reclamationRepository.save(reclamation);
    }
}
