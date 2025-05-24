import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntreprisesService } from '../entreprise.service';
import { Entreprise } from '../entreprise.model';

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
    logoUrl: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private EntreprisesService: EntreprisesService
  ) {}

  ngOnInit(): void {
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
  logoFile?: File;


  onUpdate(): void {
    this.EntreprisesService.updateEntreprise(this.entreprise).subscribe(
      (response) => {
        console.log('Entreprise updated successfully:', response);
        alert('Entreprise mise à jour avec succès !');
        this.router.navigate(['/entreprises']);
      },
      (error) => {
        console.error('Error updating entreprise:', error);
        alert('Erreur lors de la mise à jour de l\'entreprise.');
      }
    );
  }

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
}
