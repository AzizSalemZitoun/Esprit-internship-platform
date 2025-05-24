package com.esprit.GestionUtilisateur.Service;

import com.esprit.GestionUtilisateur.Entities.Offre;


import java.util.List;

public interface IOffreService {
     Offre addoffre(Offre offre);
     Offre modifyoffre(Long idOffre,Offre offre);
     void deleteoffre(Offre offre);
     List<Offre> retrieveAlloffre();
     Offre findoffreById(Long id);

     void setEntrepriseToOffre(Long idEntreprise, Long idOffre);
}
