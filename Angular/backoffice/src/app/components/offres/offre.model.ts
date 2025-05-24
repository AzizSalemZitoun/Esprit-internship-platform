import { Entreprise } from "../entreprises/entreprise.model";

export enum Type {
    PFE = 'PFE',
    PFA = 'PFA'
}

export class Offre {
    idOffre: number | null;
    titre: string;
    description: string;
    type: Type;
    duration: string;
    entreprise: Entreprise | null;
    competences: string[]; // Add this field for competences

    constructor(
        idOffre: number | null,
        titre: string,
        description: string,
        type: Type,
        duration: string,
        entreprise: Entreprise,
        competences: string[] = [] // Initialize as an empty array
    ) {
        this.idOffre = idOffre;
        this.titre = titre;
        this.description = description;
        this.type = type;
        this.duration = duration;
        this.entreprise = entreprise;
        this.competences = competences; // Initialize competences
    }
}