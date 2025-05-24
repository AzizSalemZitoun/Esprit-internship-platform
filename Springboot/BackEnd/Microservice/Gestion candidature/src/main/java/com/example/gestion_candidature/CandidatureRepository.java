package com.example.gestion_candidature;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public interface CandidatureRepository extends JpaRepository<Candidature, Integer> {

}
