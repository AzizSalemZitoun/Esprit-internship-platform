import { Component, OnInit } from '@angular/core';
import { OffresService } from './offres.service';
import { Offre } from './offre.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offres',
  templateUrl: './offres.component.html',
  styleUrls: ['./offres.component.css'],
})
export class OffresComponent implements OnInit {
  offres: Offre[] = []; // All offers
  filteredOffres: Offre[] = []; // Filtered offers
  searchTitre: string = ''; // Search by title
  searchType: string = ''; // Search by type
  selectedCompetences: string[] = []; // Selected competences (multiple)

  // Available types and competences for filters
  types: string[] = ['PFA', 'PFE']; // Replace with your types
  availableCompetences: string[] = ['Java', 'Spring', 'Symfony', 'Javascript', 'Python']; // Replace with your competences

  constructor(private offreService: OffresService, private router: Router) {}

  ngOnInit(): void {
    this.fetchOffres();
  }

  fetchOffres(): void {
    this.offreService.getAllOffres().subscribe(
      (data) => {
        this.offres = data; // Assign fetched offers to the array
        this.filteredOffres = data; // Initialize filteredOffres with all offers
      },
      (error) => {
        console.error('Error fetching offers:', error);
      }
    );
  }

  // Toggle a competence in the selectedCompetences array
  toggleCompetence(competence: string): void {
    const index = this.selectedCompetences.indexOf(competence);
    if (index === -1) {
      this.selectedCompetences.push(competence); // Add competence if not already selected
    } else {
      this.selectedCompetences.splice(index, 1); // Remove competence if already selected
    }
    this.filterOffres(); // Update the filtered offers
  }

  // Filter offers based on search criteria
  filterOffres(): void {
    this.filteredOffres = this.offres.filter((offre) => {
      const matchesTitre = offre.titre.toLowerCase().includes(this.searchTitre.toLowerCase());
      const matchesType = this.searchType ? offre.type === this.searchType : true;
      const matchesCompetences = this.selectedCompetences.length > 0
        ? this.selectedCompetences.every(competence => offre.competences.includes(competence))
        : true;
      return matchesTitre && matchesType && matchesCompetences;
    });
  }

  navigateToModifier(offre: Offre): void {
    this.router.navigate(['/offres/modifier', offre.idOffre]);
  }

  deleteOffre(idOffre: number | null): void {
    if (idOffre === null) {
      console.error('Cannot delete offer: ID is null');
      return;
    }

    if (confirm('Are you sure you want to delete this offer?')) {
      this.offreService.deleteOffre(idOffre).subscribe(
        () => {
          this.offres = this.offres.filter((offre) => offre.idOffre !== idOffre);
          this.filteredOffres = this.filteredOffres.filter((offre) => offre.idOffre !== idOffre); // Also remove from filteredOffres
        },
        (error) => {
          console.error('Error deleting offer:', error);
        }
      );
    }
  }
}