package com.esprit.GestionUtilisateur.Entities;

public class EntrepriseMapper {

    public static EntrepriseDTO toDto(Entreprise entreprise) {
        EntrepriseDTO dto = new EntrepriseDTO();
        dto.setIdEntreprise(entreprise.getIdEntreprise());
        dto.setNom(entreprise.getNom());
        dto.setRepresentative(entreprise.getRepresentative());
        dto.setAdress(entreprise.getAdress());
        dto.setDescription(entreprise.getDescription());
        dto.setWebsite(entreprise.getWebsite());
        dto.setLogoUrl(entreprise.getLogoUrl());
        // offreList is intentionally not mapped for now to avoid recursion
        return dto;
    }

    public static Entreprise toEntity(EntrepriseDTO dto) {
        Entreprise entreprise = new Entreprise();
        entreprise.setIdEntreprise(dto.getIdEntreprise());
        entreprise.setNom(dto.getNom());
        entreprise.setRepresentative(dto.getRepresentative());
        entreprise.setAdress(dto.getAdress());
        entreprise.setDescription(dto.getDescription());
        entreprise.setWebsite(dto.getWebsite());
        entreprise.setLogoUrl(dto.getLogoUrl());
        // offreList is not set here to avoid complexity unless needed
        return entreprise;
    }
}
