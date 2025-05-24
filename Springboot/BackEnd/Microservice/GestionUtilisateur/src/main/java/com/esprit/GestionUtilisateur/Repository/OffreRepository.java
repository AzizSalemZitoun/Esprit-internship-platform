package com.esprit.GestionUtilisateur.Repository;


import com.esprit.GestionUtilisateur.Entities.Offre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OffreRepository extends JpaRepository<Offre,Long> {

}
