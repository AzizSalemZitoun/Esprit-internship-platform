package com.esprit.GestionUtilisateur.Service;

import com.esprit.GestionUtilisateur.Entities.Candidature;
import com.esprit.GestionUtilisateur.Entities.Offre;
import com.esprit.GestionUtilisateur.Entities.User;
import com.esprit.GestionUtilisateur.Repository.CandidatureRepository;
import com.esprit.GestionUtilisateur.Repository.OffreRepository;
import com.esprit.GestionUtilisateur.Repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class CandidatureService implements ICandidatureService {
    private final CandidatureRepository candidatureRepository;
    private final OffreRepository offreRepository;

    private final UserRepository userRepository;

    public CandidatureService(CandidatureRepository candidatureRepository, OffreRepository offreRepository, UserRepository userRepository) {
        this.candidatureRepository = candidatureRepository;
        this.offreRepository = offreRepository;
        this.userRepository = userRepository;
    }


    @Override
    public Candidature createCandidature(Candidature candidature) {
        return candidatureRepository.save(candidature);
    }

    @Override
    public Candidature getCandidatureById(int id) {
        return candidatureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidature not found"));
    }

    @Override
    public List<Candidature> getAllCandidatures() {
        return candidatureRepository.findAll();
    }

    @Override
    public Candidature updateCandidatureStatus(int id, String newStatus) {
        Candidature candidature = getCandidatureById(id);
        candidature.setStatut(newStatus);
        return candidatureRepository.save(candidature);
    }

    @Override
    public void deleteCandidature(int id) {
        candidatureRepository.deleteById(id);
    }



    @Override
    public String postuler(Long offreId, Long userId) {
        Offre offre = offreRepository.findById(offreId)
                .orElseThrow(() -> new RuntimeException("Offre not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Candidature candidature = new Candidature();
        candidature.setOffre(offre);
        candidature.setUser(user);
        candidature.setStatut("En attente");

        candidatureRepository.save(candidature);
        return "Candidature envoyée avec succès !";
    }
}

