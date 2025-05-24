package com.esprit.GestionUtilisateur.Repository;

import com.esprit.GestionUtilisateur.Entities.Stage;
import com.esprit.GestionUtilisateur.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StageRepository extends JpaRepository<Stage, Long> {

    Optional<Stage> findByUser(User user);


}