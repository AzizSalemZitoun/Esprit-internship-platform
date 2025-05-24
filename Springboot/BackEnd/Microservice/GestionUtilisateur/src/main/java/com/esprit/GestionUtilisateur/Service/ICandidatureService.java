package com.esprit.GestionUtilisateur.Service;

import com.esprit.GestionUtilisateur.Entities.Candidature;

import java.util.List;

public interface ICandidatureService {
    Candidature createCandidature(Candidature candidature);

    Candidature getCandidatureById(int id);
    List<Candidature> getAllCandidatures();

    Candidature updateCandidatureStatus(int id, String newStatus);

    void deleteCandidature(int id);


    String postuler(Long offreId, Long userId);

}