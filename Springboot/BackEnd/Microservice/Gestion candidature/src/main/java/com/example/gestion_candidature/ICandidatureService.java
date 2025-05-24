package com.example.gestion_candidature;

import java.util.List;

public interface ICandidatureService {
    Candidature createCandidature(Candidature candidature);

    Candidature getCandidatureById(int id);
    List<Candidature> getAllCandidatures();

    Candidature updateCandidatureStatus(int id, String newStatus);

    void deleteCandidature(int id);
}