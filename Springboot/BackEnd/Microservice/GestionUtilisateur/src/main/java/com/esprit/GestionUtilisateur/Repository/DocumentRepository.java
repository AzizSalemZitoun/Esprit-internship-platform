package com.esprit.GestionUtilisateur.Repository;

import com.esprit.GestionUtilisateur.Entities.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByCandidatureId(int candidatureId);
}