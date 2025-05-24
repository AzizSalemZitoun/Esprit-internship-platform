import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ReponseDialogComponent } from 'src/app/components/reponse-dialog/reponse-dialog.component';
import { ReclamationService } from 'src/app/services/reclamation.service';
import { StageService } from 'src/app/services/stage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-listuser',
  templateUrl: './listuser.component.html',
  styleUrls: ['./listuser.component.css']
})
export class ListuserComponent implements OnInit{
  users: any[] = [];
  stages: any[] = [];

  reclamations: any[] = [];

  filteredStages: any[] = []; // Liste filtrée pour la recherche des stages
  filteredUsers: any[] = []; // Liste filtrée pour la recherche
  searchStage: string = '';   // Variable pour la recherche stage

  searchUser: string = '';   // Variable pour la recherche utilisateur
  stagePage: number = 1;      // Page actuelle pour les stages
  itemsPerPage: number = 5;  // Nombre d'éléments par page
  userPage: number = 1;      // Page actuelle pour les utilisateurs



  constructor(private userService: UserService,private stageService: StageService, private router: Router,private reclamationService: ReclamationService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadStages();  // Charger les stages depuis le backend
    this.loadReclamations();
  }
    // Charger les stages depuis le backend
    loadStages(): void {
      this.stageService.getStages().subscribe(
        (stages) => {
          this.stages = stages;
        },
        (error) => {
          console.error('Erreur lors du chargement des stages:', error);
        }
      );
    }
    // Éditer un stage
  editStage(id: number): void {
    // Rediriger l'utilisateur vers la page d'édition du stage (vous devrez configurer une route pour l'édition)
    this.router.navigate(['/edit-stage', id]);
  }

  // Copier un stage (logique à implémenter, ici un simple log pour l'exemple)
  copyStage(id: number): void {
    console.log(`Stage copié avec ID: ${id}`);
    // Ajouter la logique de duplication du stage ici
  }

  // Supprimer un stage
  deleteStage(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce stage?')) {
      this.stageService.deleteStage(id).subscribe(
        (response) => {
          console.log('Stage supprimé avec succès:', response);
          this.loadStages(); // Recharger la liste après suppression
        },
        (error) => {
          console.error('Erreur lors de la suppression du stage:', error);
        }
      );
    }
  }

  // Méthode pour récupérer la lettre d'affectation d'un stage
  downloadLettre(id: number): void {
    this.stageService.getLettreAffectation(id).subscribe(
      (response: Blob) => { // Spécifier le type Blob
        const fileURL = URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = `lettre_affectation_${id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      (error) => {
        console.error('Erreur lors de la récupération de la lettre:', error);
      }
    );
  }


  viewStageFile(stageId: number) {
    this.stageService.getStageFile(stageId).subscribe((fileBlob) => {
      const fileURL = URL.createObjectURL(fileBlob);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `stage_file_${stageId}.pdf`; // Nom du fichier à télécharger
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, (error) => {
      console.error('Erreur lors du chargement du fichier', error);
    });
  }





  // Méthode pour récupérer les utilisateurs
  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        console.log(data);  // Vérifier les données retournées
        this.users = data.map(user => ({
          ...user,
          is_verified: user.verified ? 'Vérifié' : 'Non vérifié',
          is_accepted: user.accepted ? 'Accepté' : 'Non accepté'
        }));
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    );
  }

  // Méthode pour accepter un utilisateur
  acceptUser(userId: number): void {
    this.userService.acceptUser(userId).subscribe(
      (response) => {
        console.log('Utilisateur accepté:', response);
        this.loadUsers();  // Recharger les utilisateurs après l'acceptation
      },
      (error) => {
        console.error('Erreur lors de l\'acceptation de l\'utilisateur:', error);
      }
    );
  }

  // Méthode pour bloquer un utilisateur (cela pourrait être une autre API si nécessaire)
  blockUser(userId: number): void {
    this.userService.blockUser(userId).subscribe(
      (response) => {
        console.log('Utilisateur bloqué:', response);
        this.loadUsers();  // Recharger les utilisateurs après le blocage
      },
      (error) => {
        console.error('Erreur lors du blocage de l\'utilisateur:', error);
      }
    );
  }
  // Filtrer les utilisateurs en fonction de la recherche
  filterUsers() {
    this.filteredUsers = this.users.filter(user =>
      user.nom.toLowerCase().includes(this.searchUser.toLowerCase()) ||
      user.prenom.toLowerCase().includes(this.searchUser.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchUser.toLowerCase())
    );
    console.log(this.filteredUsers); // Vérifier que la liste filtrée contient bien des utilisateurs
  }


  // Filtrer les stages en fonction de la recherche
  filterStages(): void {
    this.filteredStages = this.stages.filter(stage =>
      stage.description.toLowerCase().includes(this.searchStage.toLowerCase()) ||
      stage.name.toLowerCase().includes(this.searchStage.toLowerCase())
    );
  }

  loadReclamations(): void {
    this.reclamationService.getAllReclamations().subscribe(
      (data) => {
        this.reclamations = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des réclamations:', error);
      }
    );
  }
  deleteReclamation(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette réclamation ?')) {
      this.reclamationService.deleteReclamation(id).subscribe(
        () => {
          alert('Réclamation supprimée avec succès !');
          this.loadReclamations();  // Recharge la liste après suppression
        },
        (error) => {
          console.error('Erreur lors de la suppression de la réclamation:', error);
        }
      );
    }
  }

  ouvrirDialog(reclamationId: number): void {
    const dialogRef = this.dialog.open(ReponseDialogComponent, {
      width: '400px',
      data: { reclamationId }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadReclamations(); // Recharge les réclamations après réponse
      }
    });
  }
  

}
