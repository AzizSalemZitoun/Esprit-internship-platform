package com.esprit.GestionUtilisateur.Controller;

import com.esprit.GestionUtilisateur.Entities.Reponse;
import com.esprit.GestionUtilisateur.Service.ReponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reponses")
public class ReponseController {

    @Autowired
    private ReponseService reponseService;

    // Ajouter une réponse à une réclamation
    @PostMapping("/reclamation/{reclamationId}")
    public Reponse createReponse(@PathVariable Long reclamationId, @RequestBody Reponse reponse) {
        return reponseService.createReponse(reclamationId, reponse);
    }

    // Obtenir une réponse par ID
    @GetMapping("/{id}")
    public Reponse getReponseById(@PathVariable Long id) {
        return reponseService.getReponseById(id);
    }

    // Obtenir la réponse d'une réclamation spécifique
    @GetMapping("/reclamation/{reclamationId}")
    public Reponse getReponseByReclamationId(@PathVariable Long reclamationId) {
        return reponseService.getReponseByReclamationId(reclamationId);
    }

    // Obtenir toutes les réponses
    @GetMapping("/all")
    public List<Reponse> getAllReponses() {
        return reponseService.getAllReponses();
    }

    // Modifier une réponse
    @PutMapping("/{id}")
    public Reponse updateReponse(@PathVariable Long id, @RequestBody Reponse reponse) {
        return reponseService.updateReponse(id, reponse);
    }

    // Supprimer une réponse
    @DeleteMapping("/{id}")
    public void deleteReponse(@PathVariable Long id) {
        reponseService.deleteReponse(id);
    }
}
