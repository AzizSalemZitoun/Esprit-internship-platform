import { Component, OnInit } from '@angular/core';
import { Offre, Type } from '../offre.model';
import { OffresService } from '../offres.service';
import { Entreprise } from '../../entreprise/entreprise.model';
import { Router } from '@angular/router';
import { EntreprisesService } from '../../entreprise/entreprise.service'; // Add this import

@Component({
  selector: 'app-offresajouter',
  templateUrl: './offresajouter.component.html',
  styleUrls: ['./offresajouter.component.css']
})
export class OffresajouterComponent implements OnInit {
  offre: Offre = {
    idOffre: null,
    titre: '',
    description: '',
    type: Type.PFE,
    duration: '',
    entreprise: null,
    competences: []
  };

  types = Object.values(Type);
  availableCompetences: string[] = ['Java', 'Spring', 'Symfony', 'Javascript', 'Python'];
  selectedCompetences: string[] = [];
  entreprises: Entreprise[] = []; // List of existing entreprises

  constructor(
    private offresService: OffresService,
    private entrepriseService: EntreprisesService, // Add this
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchEntreprises(); 
  }
  
  fetchEntreprises(): void {
    this.entrepriseService.getAllEntreprises().subscribe({
      next: (data) => {
        this.entreprises = data; 
        console.log('Entreprises fetched:', this.entreprises); 
      },
      error: (error) => {
        console.error('Error fetching entreprises:', error);
        alert('Erreur lors de la récupération des entreprises. Veuillez réessayer plus tard.');
      }
    });
  }
  addCompetence(competence: string) {
    if (!this.selectedCompetences.includes(competence)) {
      this.selectedCompetences.push(competence);
    }
  }

  removeCompetence(competence: string) {
    this.selectedCompetences = this.selectedCompetences.filter(c => c !== competence);
  }

  onSubmit() {
    this.offre.competences = this.selectedCompetences;

    this.offresService.createOffre(this.offre).subscribe(
      (response) => {
        console.log('Offre created successfully:', response);
        alert('Offre ajoutée avec succès !');
        this.router.navigate(['/offres']);
      },
      (error) => {
        console.error('Error creating offre:', error);
        alert('Erreur lors de l\'ajout de l\'offre.');
      }
    );
  }
}