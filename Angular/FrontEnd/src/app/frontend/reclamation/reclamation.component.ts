import { Component, OnInit } from '@angular/core';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-reclamation',
  templateUrl: './reclamation.component.html',
  styleUrls: ['./reclamation.component.css']
})
export class ReclamationComponent implements OnInit {
  reclamations: any[] = [];
  newReclamation: any = {
    description: '',
    typeRec: '',
    typeStatus: 'PENDING', // Statut par défaut
    createDate: new Date(),
    user: { id: null } // Correction de `userId` → `user: { id: 1 }`
  };

  constructor(private reclamationService: ReclamationService) { }


  

  ngOnInit(): void {
    this.getReclamations();
    this.getReclamationsByUser();
  }

  // Récupérer toutes les réclamations
  getReclamations(): void {
    this.reclamationService.getAllReclamations().subscribe(data => {
      this.reclamations = data;
    });
  }

  

  // Créer une nouvelle réclamation
  createReclamation(form: any): void {
    if (form.valid) {
      if (this.newReclamation.description.length > 100) {
        alert('La description ne peut pas dépasser 100 caractères.');
        return;
      }

      this.reclamationService.createReclamation(this.newReclamation).subscribe(
        response => {
          console.log('Réclamation envoyée:', response);
          alert('Réclamation envoyée avec succès !');
          this.resetForm(); // Réinitialiser le formulaire
        },
        error => {
          console.error('Erreur:', error);
          alert('Erreur lors de l\'envoi de la réclamation');
        }
      );
    } else {
      console.log('Le formulaire est invalide');
    }
  }

  // Réinitialiser le formulaire
  resetForm(): void {
    this.newReclamation = {
      description: '',
      typeRec: '',
      typeStatus: 'PENDING', // Garder le statut par défaut
      createDate: new Date().toISOString().split('T')[0],
      user: { id: null }
    };
  }

  getReclamationsByUser(): void {
    this.reclamationService.getReclamationsByUser().subscribe(data => {
      this.reclamations = data.map(reclamation => ({
        ...reclamation,
        createDate: new Date(reclamation.createDate) // Assurez-vous que la date soit un objet Date
      }));
    });
  }

  deleteReclamation(id: number): void {
    this.reclamationService.deleteReclamation(id).subscribe(() => {
      console.log('Réclamation supprimée');
      alert('Réclamation supprimée avec succès');
      this.getReclamations(); // Rafraîchir la liste des réclamations
    });
  }

  // Modifier une réclamation
  editReclamation(id: number): void {
    const reclamationToEdit = this.reclamations.find(r => r.idRec === id);
    this.newReclamation = { ...reclamationToEdit };
  }


  



}
