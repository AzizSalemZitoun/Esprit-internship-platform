export interface Candidature {
    id: number;
    studentId: number;
    internshipOfferId: number;
    datePostulation: Date;
    statut: string; // e.g., "PENDING", "ACCEPTED", "REJECTED"
  }