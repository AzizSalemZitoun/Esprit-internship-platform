package com.esprit.GestionUtilisateur.Service;

import com.esprit.GestionUtilisateur.Entities.Entreprise;
import com.esprit.GestionUtilisateur.Entities.Offre;
import com.esprit.GestionUtilisateur.Repository.EntrepriseRepository;
import com.esprit.GestionUtilisateur.Repository.OffreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class OffreService implements IOffreService {
    @Autowired
    OffreRepository offreRepository;
    @Autowired
    EntrepriseRepository entrepriseRepository;

    public Offre addoffre(Offre offre){

        return offreRepository.save(offre);}
    public Offre modifyoffre(Long idOffre,Offre offre){
         Offre o=offreRepository.findById(idOffre).get();
        o.setDescription(offre.getDescription());
        o.setDuration(offre.getDuration());
        o.setType(offre.getType());
        o.setTitre(offre.getTitre());
        return offreRepository.save(o);

    }
    public void deleteoffre(Offre offre){offreRepository.delete(offre);}
    public List<Offre> retrieveAlloffre(){return offreRepository.findAll();}
    public Offre findoffreById(Long id){return offreRepository.findById(id).get();}
    @Override
    public void setEntrepriseToOffre(Long idEntreprise, Long idOffre){

        Entreprise entreprise= entrepriseRepository.findById(idEntreprise).get();
        Offre offre= offreRepository.findById(idOffre).get();

            entreprise.getOffreList().add(offre);
            offre.setEntreprise(entreprise);
            offreRepository.save(offre);
            entrepriseRepository.save(entreprise);}


    }

