package com.example.gestion_candidature;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Candidature {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "student_id", nullable = false)
    @Min(value = 1, message = "L'ID de l'étudiant doit être un nombre positif.")
    private Long studentId;

    @Column(name = "internship_offer_id", nullable = false)
    @Min(value = 1, message = "L'ID de l'offre de stage doit être un nombre positif.")
    private Long internshipOfferId;

    private LocalDate datePostulation;
    @OneToMany(mappedBy = "candidature", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Document> documents;


    public List<Document> getDocuments() {
        return documents;
    }

    public void setDocuments(List<Document> documents) {
        this.documents = documents;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public LocalDate getDatePostulation() {
        return datePostulation;
    }

    public void setDatePostulation(LocalDate datePostulation) {
        this.datePostulation = datePostulation;
    }

    public Long getInternshipOfferId() {
        return internshipOfferId;
    }

    public void setInternshipOfferId(Long internshipOfferId) {
        this.internshipOfferId = internshipOfferId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    private String statut = "PENDING";

    @PrePersist
    protected void onCreate() {
        datePostulation = LocalDate.now();
    }
}