import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntreprisesService } from '../../entreprise.service';
import { Entreprise } from '../../entreprise.model';

@Component({
  selector: 'app-entreprisemodifier',
  templateUrl: './entreprisemodifier.component.html',
  styleUrls: ['./entreprisemodifier.component.css']
})
export class EntreprisemodifierComponent implements OnInit {
  entreprise: Entreprise = {
    idEntreprise: null,
    nom: '',
    representative: '',
    adress: '',
    description: '',
    website: '',
    logoUrl: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private EntreprisesService: EntreprisesService // Adjusted service for Entreprise
  ) {}

  ngOnInit(): void {
    // Fetch the entreprise to be updated
    const id = this.route.snapshot.params['id'];
    this.EntreprisesService.getEntrepriseById(id).subscribe(
      (data) => {
        this.entreprise = data;
      },
      (error) => {
        console.error('Error fetching entreprise:', error);
      }
    );
  }

  onUpdate(): void {
    this.EntreprisesService.updateEntreprise(this.entreprise).subscribe(
      (response) => {
        console.log('Entreprise updated successfully:', response);
        alert('Entreprise mise à jour avec succès !');
        this.router.navigate(['/entreprises']); // Navigate back to the entreprises list
      },
      (error) => {
        console.error('Error updating entreprise:', error);
        alert('Erreur lors de la mise à jour de l\'entreprise.');
      }
    );
  }
}
