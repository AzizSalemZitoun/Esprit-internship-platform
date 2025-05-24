import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EntreprisesService } from './entreprise.service';
import { Entreprise } from './entreprise.model';
import { Offre } from '../offres/offre.model'; // Adjust path if needed
import { OffresService } from '../offres/offres.service';

@Component({
  selector: 'app-entreprisedefault',
  templateUrl: './entreprisedefault.component.html',
  styleUrls: ['./entreprisedefault.component.css']
})
export class EntreprisedefaultComponent implements OnInit {
  entreprise: Entreprise | undefined;
  offres: Offre[] = [];

  constructor(
    private router: Router,
    private entreprisesService: EntreprisesService,
    private offresService: OffresService) {}

  ngOnInit(): void {
    const entrepriseId = 2; // Static for now
    this.loadEntrepriseById(entrepriseId);
    this.loadOffresByEntrepriseId(entrepriseId);
  }

  loadEntrepriseById(id: number): void {
    this.entreprisesService.getEntrepriseById(id).subscribe({
      next: (data) => {
        this.entreprise = data;
      },
      error: (e) => console.error('Error loading entreprise', e)
    });
  }
  deleteOffre(id: number | null): void {
    if (id === null) {
      console.error('Offre ID is null. Cannot delete.');
      return;
    }

    if (confirm('Are you sure you want to delete this offre?')) {
      this.offresService.deleteOffre(id).subscribe({
        next: () => {
          this.offres = this.offres.filter(offre => offre.idOffre !== id); // Remove the deleted offre from the UI
          
          alert('Offre supprimée avec succès !');
        },
        error: (e) => {
          console.error('Error deleting offre:', e);
          alert('Erreur lors de la suppression de l\'offre.');
        }
      });
    }
  }

  loadOffresByEntrepriseId(id: number): void {
    this.entreprisesService.getOffresByEntreprise(id).subscribe({
      next: (data) => {
        this.offres = data;
      },
      error: (e) => console.error('Error loading offres', e)
    });
  }
}
