package com.esprit.GestionUtilisateur.Service;

import com.esprit.GestionUtilisateur.Entities.Entreprise;
import com.esprit.GestionUtilisateur.Entities.EntrepriseDTO;
import com.esprit.GestionUtilisateur.Entities.Offre;

import java.util.List;
import java.util.Map;


public interface IEntrepriseService {
     EntrepriseDTO addEntreprise(EntrepriseDTO entreprise);
     EntrepriseDTO modifyentreprise(Long idEntreprise,EntrepriseDTO entreprise);
     void deleteEntreprise(EntrepriseDTO entreprise);
     List<EntrepriseDTO> retrieveAllEntreprise();
     EntrepriseDTO findEntrepriseById(Long id);

     public Map<String, Integer> getCompetencesStats(Long entrepriseId);

     List<Offre> getOffreEntrepriseId(Long entrepriseid);

     Entreprise saveEntreprise(Entreprise entreprise);
}
