export interface Candidature {
    id?: number;          
    internshipOfferId?: number; 
    datePostulation: Date;
    statut: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  }