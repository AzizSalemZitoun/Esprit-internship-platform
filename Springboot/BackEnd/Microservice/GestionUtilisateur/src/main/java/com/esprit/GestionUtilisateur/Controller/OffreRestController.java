package com.esprit.GestionUtilisateur.Controller;


import com.esprit.GestionUtilisateur.Entities.Offre;
import com.esprit.GestionUtilisateur.Service.IEntrepriseService;
import com.esprit.GestionUtilisateur.Service.IOffreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/offres")
public class OffreRestController {
    @Autowired
    IOffreService offreService;
    @Autowired
    IEntrepriseService entrepriseService;

    @PutMapping("/update")
    public Offre updateOffre(@RequestParam Long idOffre, @RequestBody Offre offre) {
        return offreService.modifyoffre(idOffre,offre);
    }

    @GetMapping("/list")
    public List<Offre> retrieveAllOffres() {
        return offreService.retrieveAlloffre();
    }

    @GetMapping("/list/{id}")
    public Offre retrieveById(@PathVariable("id") Long id) {
        return offreService.findoffreById(id);
    }

    @PostMapping("/ajouter")
    public Offre addOffre(@RequestBody Offre offre) {
        return offreService.addoffre(offre);
    }

    @PostMapping("/setentreprise")
    public void setEntreprisetoOffer(@RequestParam Long idE,@RequestParam Long idO){
        offreService.setEntrepriseToOffre(idE,idO);

    }
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable("id")Long id){
        Offre offer=offreService.findoffreById(id);
        offreService.deleteoffre(offer);

    }

}
