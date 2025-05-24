package com.esprit.GestionUtilisateur.Service;

import com.esprit.GestionUtilisateur.Entities.*;
import com.esprit.GestionUtilisateur.Repository.EntrepriseRepository;
import com.esprit.GestionUtilisateur.Repository.OffreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
public class EntrepriseService implements IEntrepriseService {

    @Autowired
    EntrepriseRepository entrepriseRepository;

    @Autowired
    OffreRepository offreRepository;

    // ✅ Ajouter une entreprise à partir d’un DTO

    @Override
    public Entreprise saveEntreprise(Entreprise entreprise) {
        return entrepriseRepository.save(entreprise);  // Enregistrer l'entreprise dans la base de données
    }
    public EntrepriseDTO addEntreprise(EntrepriseDTO entrepriseDto) {
        Entreprise entreprise = EntrepriseMapper.toEntity(entrepriseDto);
        Entreprise saved = entrepriseRepository.save(entreprise);
        return EntrepriseMapper.toDto(saved);
    }

    // ✅ Modifier une entreprise existante
    public EntrepriseDTO modifyentreprise(Long idEntreprise, EntrepriseDTO entrepriseDto) {
        Entreprise e = entrepriseRepository.findById(idEntreprise).orElseThrow();

        e.setAdress(entrepriseDto.getAdress());
        e.setNom(entrepriseDto.getNom());
        e.setRepresentative(entrepriseDto.getRepresentative());
        e.setLogoUrl(entrepriseDto.getLogoUrl());
        e.setWebsite(entrepriseDto.getWebsite());
        e.setDescription(entrepriseDto.getDescription());

        Entreprise updated = entrepriseRepository.save(e);
        return EntrepriseMapper.toDto(updated);
    }

    public void deleteEntreprise(EntrepriseDTO entrepriseDTO) {
        Entreprise entreprise = EntrepriseMapper.toEntity(entrepriseDTO); // Convert DTO to entity
        entrepriseRepository.delete(entreprise); // Delete the entity
    }

    // ✅ Retourner la liste des entreprises sous forme de DTO
    public List<EntrepriseDTO> retrieveAllEntreprise() {
        return entrepriseRepository.findAll()
                .stream()
                .map(EntrepriseMapper::toDto)
                .collect(Collectors.toList());
    }


    public EntrepriseDTO findEntrepriseById(Long id) {
        Entreprise entreprise = entrepriseRepository.findById(id).get();
        return EntrepriseMapper.toDto(entreprise);
    }

    @Override
    public Map<String, Integer> getCompetencesStats(Long entrepriseId) {
        Entreprise entreprise = entrepriseRepository.findById(entrepriseId)
                .orElseThrow(() -> new RuntimeException("Entreprise not found with id: " + entrepriseId));

        List<Offre> offers = entreprise.getOffreList();
        Map<String, Integer> competenceStats = new HashMap<>();

        for (Offre offre : offers) {
            for (Competences competence : offre.getCompetences()) {
                String competenceName = competence.name();
                competenceStats.put(competenceName, competenceStats.getOrDefault(competenceName, 0) + 1);
            }
        }

        return competenceStats;
    }
@Override
    public List<Offre> getOffreEntrepriseId(Long entrepriseid){
        Entreprise entreprise=entrepriseRepository.findById(entrepriseid).get();
        return offreRepository.findAll()
                 .stream()
                 .filter(offre -> offre.getEntreprise()==entreprise)
                 .collect(Collectors.toList());
    }


}
