import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OffresService } from '../offres.service';
import { Offre, Type } from '../offre.model';
import { Entreprise } from '../../entreprise/entreprise.model';

@Component({
  selector: 'app-offresmodifier',
  templateUrl: './offresmodifier.component.html',
  styleUrls: ['./offresmodifier.component.css']
})
export class OffresmodifierComponent implements OnInit {
  offre: Offre = {
    idOffre: null,
    titre: '',
    description: '',
    type: Type.PFE,
    duration: '',
    entreprise: null,
    competences: [] // Initialize competences as an empty array
  };

  types = Object.values(Type);

  // List of available competences
  availableCompetences: string[] = ['Java', 'Spring', 'Symfony', 'Javascript', 'Python'];

  // List of selected competences
  selectedCompetences: string[] = [];

  // Input for new competence
  newCompetence: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private offresService: OffresService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id']; // Get the ID from the route
    if (id) {
      console.log('Fetching offer with ID:', id); // Debugging log
      this.offresService.getOffreById(id).subscribe(
        (data) => {
          this.offre = data;
          this.selectedCompetences = this.offre.competences || []; // Initialize selected competences
          console.log('Offre fetched:', this.offre); // Debugging log
        },
        (error) => {
          console.error('Error fetching offer:', error);
        }
      );
    } else {
      console.error('Offre ID is missing. Cannot fetch offer.'); // Debugging log
    }
  }

  // Add a competence to the selected list
  addCompetence(competence?: string) {
    if (competence) {
      if (!this.selectedCompetences.includes(competence)) {
        this.selectedCompetences.push(competence);
      }
    } else if (this.newCompetence.trim() !== '') {
      if (!this.selectedCompetences.includes(this.newCompetence)) {
        this.selectedCompetences.push(this.newCompetence);
        this.newCompetence = '';
      }
    }
  }

  // Remove a competence from the selected list
  removeCompetence(competence: string) {
    this.selectedCompetences = this.selectedCompetences.filter(c => c !== competence);
  }

  // Submit the form
  onUpdate(): void {
    if (this.offre.idOffre) {
      // Assign the selected competences to the Offre object
      this.offre.competences = this.selectedCompetences;

      console.log('Updating offre:', this.offre); // Debugging log
      this.offresService.updateOffre(this.offre.idOffre, this.offre).subscribe(
        (response) => {
          console.log('Offre updated successfully:', response);
          alert('Offre mise à jour avec succès!');
          this.router.navigate(['/offres']);
        },
        (error) => {
          console.error('Error updating offer:', error);
          alert('Erreur lors de la mise à jour de l\'offre.');
        }
      );
    } else {
      console.error('Offre ID is missing. Cannot update.'); // Debugging log
    }
  }

  cancel(): void {
    this.router.navigate(['/offres']); // Navigate back to the offers list
  }
}