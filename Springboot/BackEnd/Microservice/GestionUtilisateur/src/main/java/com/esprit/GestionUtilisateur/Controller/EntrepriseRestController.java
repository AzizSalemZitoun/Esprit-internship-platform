package com.esprit.GestionUtilisateur.Controller;


import com.esprit.GestionUtilisateur.Entities.*;
import com.esprit.GestionUtilisateur.Repository.EntrepriseRepository;
import com.esprit.GestionUtilisateur.Repository.UserRepository;
import com.esprit.GestionUtilisateur.Service.IEntrepriseService;
import com.esprit.GestionUtilisateur.Service.UserServiceImpl;
import com.esprit.GestionUtilisateur.ServiceAPI.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/entreprise")
public class EntrepriseRestController {

    @Autowired
    IEntrepriseService entrepriseService;

    @Autowired
    UserServiceImpl userService;
    @Autowired
    private EntrepriseRepository entrepriseRepository;
    @Autowired
    private UserRepository userRepository;

    @PutMapping("/update")
    public EntrepriseDTO updateEntreprise(@RequestParam Long idEntreprise, @RequestBody EntrepriseDTO entrepriseDTO) {
        return entrepriseService.modifyentreprise(idEntreprise, entrepriseDTO);
    }

    // Récupérer la liste de toutes les entreprises (utilisation de EntrepriseDTO)
    @GetMapping("/list")
    public List<EntrepriseDTO> retrieveAllentreprises() {
        return entrepriseService.retrieveAllEntreprise();
    }

    // Récupérer une entreprise par son ID (utilisation de EntrepriseDTO)
    @GetMapping("/list/{id}")
    public EntrepriseDTO retrieveById(@PathVariable("id") Long id) {
        return entrepriseService.findEntrepriseById(id);
    }

    // Ajouter une entreprise (utilisation de EntrepriseDTO)
    @PostMapping("/ajouter")
    public ResponseEntity<?> addEntreprise(@RequestBody EntrepriseDTO entrepriseDTO,
                                           HttpServletRequest request) {
        User currentUser = userService.getCurrentUser(request);

        if (currentUser == null || currentUser.getRole() != Role.RESPONSABLE_ENTREPRISE) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Accès refusé.");
        }

        Entreprise entreprise = EntrepriseMapper.toEntity(entrepriseDTO);
        entreprise.setUser(currentUser); // Association ici
        Entreprise saved = entrepriseRepository.save(entreprise);

        // Mise à jour bidirectionnelle si tu veux la refléter aussi côté user :
        currentUser.setEntreprise(saved);
        userRepository.save(currentUser);

        return ResponseEntity.ok(EntrepriseMapper.toDto(saved));
    }


    // Supprimer une entreprise
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable("id") Long id) {
        EntrepriseDTO entreprise = entrepriseService.findEntrepriseById(id);
        entrepriseService.deleteEntreprise(entreprise);
    }

    // Récupérer les statistiques de compétences d'une entreprise (restant inchangé)
    @GetMapping("/competences/{id}")
    public Map<String, Integer> getCompetencesStats(@PathVariable("id") Long entrepriseId) {
        return entrepriseService.getCompetencesStats(entrepriseId);
    }
    @GetMapping("/fetchoffers/{id}")
    public List<Offre> getOffresByEntreprise(@PathVariable Long id) {
        return entrepriseService.getOffreEntrepriseId(id);
    }
}
