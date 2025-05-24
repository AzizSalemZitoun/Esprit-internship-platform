import { Component } from '@angular/core';
import { Entreprise } from '../entreprise.model';
import { EntreprisesService } from '../entreprise.service';

@Component({
  selector: 'app-entrepriseajouter',
  templateUrl: './entreprise.component.html',
  styleUrls: ['./entreprise.component.css']
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
  fetchCompanyInfo() {
    const companyName = this.entreprise.nom;

    // Check if company name is provided
    if (!companyName) {
      alert("Veuillez entrer le nom de l'entreprise.");
      return;
    }

    this.entreprisesService.getCompanyInfo(companyName).subscribe(
      (response) => {
        // If AI data is found, autofill the form
        if (response) {
          this.entreprise.representative = response.representative || '';
          this.entreprise.adress = response.address || '';
          this.entreprise.description = response.description || '';
          this.entreprise.website = response.website || '';
          this.entreprise.logoUrl = response.logoUrl || '';
        } else {
          alert("Aucune donnée trouvée pour cette entreprise.");
        }
      },
      (error) => {
        console.error("Erreur lors de la récupération des données de l'entreprise:", error);
        alert("Erreur lors de la récupération des données.");
      }
    );
  }
  // Image upload
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

  onSubmit() {
    // Optionally use FormData if you want to send the file
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
