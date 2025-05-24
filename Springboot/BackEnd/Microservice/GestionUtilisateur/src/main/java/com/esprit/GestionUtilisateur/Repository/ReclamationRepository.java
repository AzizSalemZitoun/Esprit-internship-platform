package com.esprit.GestionUtilisateur.Repository;

import com.esprit.GestionUtilisateur.Entities.Reclamation;
import com.esprit.GestionUtilisateur.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReclamationRepository extends JpaRepository<Reclamation, Long> {
    List<Reclamation> findByUser(User user);
}
