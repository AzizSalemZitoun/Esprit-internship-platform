import { Entreprise } from "../entreprise/entreprise.model";

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
    competences: string[]; 

    constructor(
        idOffre: number | null,
        titre: string,
        description: string,
        type: Type,
        duration: string,
        entreprise: Entreprise,
        competences: string[] = [] 
    ) {
        this.idOffre = idOffre;
        this.titre = titre;
        this.description = description;
        this.type = type;
        this.duration = duration;
        this.entreprise = entreprise;
        this.competences = competences; 
    }
}