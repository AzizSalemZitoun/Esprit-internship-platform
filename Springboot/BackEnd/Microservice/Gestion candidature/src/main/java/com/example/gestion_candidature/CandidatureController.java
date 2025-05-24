package com.example.gestion_candidature;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/candidatures")
@CrossOrigin(origins = "http://localhost:4200")
public class CandidatureController {
    private final CandidatureService candidatureService;

    public CandidatureController(CandidatureService candidatureService) {
        this.candidatureService = candidatureService;
    }

    @PostMapping
    public ResponseEntity<Candidature> createCandidature(@Valid @RequestBody Candidature candidature) {
        return ResponseEntity.ok(candidatureService.createCandidature(candidature));
    }

    @GetMapping
    public ResponseEntity<List<Candidature>> getAllCandidatures() {
        return ResponseEntity.ok(candidatureService.getAllCandidatures());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Candidature> getCandidature(@PathVariable int id) {
        return ResponseEntity.ok(candidatureService.getCandidatureById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Candidature> updateStatus(
            @PathVariable int id,
            @RequestParam String newStatus
    ) {
        return ResponseEntity.ok(candidatureService.updateCandidatureStatus(id, newStatus));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCandidature(@PathVariable int id) {
        candidatureService.deleteCandidature(id);
        return ResponseEntity.noContent().build();
    }
}
