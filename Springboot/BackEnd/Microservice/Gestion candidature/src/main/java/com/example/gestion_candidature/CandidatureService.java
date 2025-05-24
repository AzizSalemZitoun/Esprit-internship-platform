package com.example.gestion_candidature;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class CandidatureService implements ICandidatureService {
    private final CandidatureRepository candidatureRepository;

    public CandidatureService(CandidatureRepository candidatureRepository) {
        this.candidatureRepository = candidatureRepository;
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
}