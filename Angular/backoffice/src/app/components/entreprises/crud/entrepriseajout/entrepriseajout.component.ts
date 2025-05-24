import { Component } from '@angular/core';
import { Entreprise } from '../../entreprise.model';
import { EntreprisesService } from '../../entreprise.service';

@Component({
  selector: 'app-entrepriseajouter',
  templateUrl: './entrepriseajout.component.html',
  styleUrls: ['./entrepriseajout.component.css']
})
export class EntrepriseajouterComponent {
  entreprise: Entreprise = {
    idEntreprise: null, 
    nom: '',
    representative: '',
    adress: '',
    description: '',
    website: '',
    logoUrl: ''
  };
  logoFile?: File;

  constructor(private entreprisesService: EntreprisesService) {}
  onLogoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.logoFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.entreprise.logoUrl = reader.result as string;
      };
      reader.readAsDataURL(file); // or keep it as File if sending FormData
    }
  }
  // Handle form submission for creating a new entreprise
  onSubmit() {
    this.entreprisesService.createEntreprise(this.entreprise).subscribe(
      (response) => {
        console.log('Entreprise created successfully:', response);
        alert('Entreprise ajoutée avec succès !');
      },
      (error) => {
        console.error('Error creating entreprise:', error);
        alert('Erreur lors de l\'ajout de l\'entreprise.');
      }
    );
  }
}
