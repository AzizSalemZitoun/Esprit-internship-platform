import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OffresService } from './offres.service';
import { Offre } from './offre.model';
import { Entreprise } from '../entreprise/entreprise.model';

@Component({
  selector: 'app-offresdefault',
  templateUrl: './offredefault.component.html',
  styleUrls: ['./offredefault.component.css']
})
export class OffresdefaultComponent implements OnInit {
  offres: Offre[] = []; // Array to store all offers
  filteredOffres: Offre[] = []; // Array to store filtered offers
  searchTitre: string = ''; // Search by title
  searchType: string = ''; // Search by type
  searchCompetence: string = ''; // Search by competence

  // Available types and competences for filters
  types: string[] = ['PFA', 'PFE'];
  availableCompetences: string[] = ['Java', 'Spring', 'Symfony', 'Javascript', 'Python'];

  constructor(private offresService: OffresService, private router: Router) { }

  ngOnInit(): void {
    this.loadOffres(); // Fetch offers on component initialization
  }

  // Fetch all offers
  loadOffres(): void {
    this.offresService.getAllOffres().subscribe({
      next: (data) => {
        this.offres = data; // Assign fetched offers to the array
        this.filteredOffres = data; // Initialize filteredOffres with all offers
        console.log('Offres fetched:', this.offres); // Debugging log
      },
      error: (e) => {
        console.error('Error fetching offres:', e); // Log error
      }
    });
  }

  // Filter offers based on search criteria
  filterOffres(): void {
    this.filteredOffres = this.offres.filter((offre) => {
      const matchesTitre = offre.titre.toLowerCase().includes(this.searchTitre.toLowerCase());
      const matchesType = this.searchType ? offre.type === this.searchType : true;
      const matchesCompetence = this.searchCompetence ? offre.competences.includes(this.searchCompetence) : true;
      return matchesTitre && matchesType && matchesCompetence;
    });
  }

  // Navigate to the modify page for a specific offer
  navigateToModifier(offre: Offre): void {
    this.router.navigate(['/offres/modifier', offre.idOffre]);
  }

  // Delete an offer by ID
  deleteOffre(id: number | null): void {
    if (id === null) {
      console.error('Offre ID is null. Cannot delete.');
      return;
    }

    if (confirm('Are you sure you want to delete this offre?')) {
      this.offresService.deleteOffre(id).subscribe({
        next: () => {
          this.offres = this.offres.filter(offre => offre.idOffre !== id); // Remove the deleted offre from the UI
          this.filteredOffres = this.filteredOffres.filter(offre => offre.idOffre !== id); // Also remove from filteredOffres
          alert('Offre supprimée avec succès !');
        },
        error: (e) => {
          console.error('Error deleting offre:', e);
          alert('Erreur lors de la suppression de l\'offre.');
        }
      });
    }
  }
  
}