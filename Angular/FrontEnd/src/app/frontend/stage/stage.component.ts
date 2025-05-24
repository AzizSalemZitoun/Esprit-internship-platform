import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { StageService } from 'src/app/services/stage.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css'],
})
export class StageComponent implements OnInit {
  ownedBy: string = '';
  description: string = '';
  file: File | null = null;
  stages: any[] = [];
  userStage: any;  // Pour afficher le stage de l'utilisateur
  currentUser: { nom: string, prenom: string, email: string, role: string } | null = null;
    stageId: number = 0;  // Définir un stageId

    isUploading: boolean = false;



  constructor(private stageService: StageService,private authService: AuthService, private router: Router, private toastr: ToastrService ) {}

  ngOnInit(): void {
    // Charger les stages si nécessaire
    this.loadStages();
    this.loadUserStage();  // Charger le stage spécifique de l'utilisateur
    this.currentUser = this.authService.getCurrentUser();
  }

  // Méthode pour uploader un fichier et créer un stage
  onFileChange(event: any): void {
    this.file = event.target.files[0];
  }

  uploadStage(): void {
    if (!this.file) {
      console.error('Aucun fichier sélectionné');
      return;
    }

    this.isUploading = true; // Désactiver le bouton

    this.stageService.uploadStage(this.ownedBy, this.description, this.file).subscribe(
      (response) => {
        console.log('Stage téléchargé:', response);
        this.loadStages(); // Recharger les stages après l'upload
        this.isUploading = false; // Réactiver le bouton après succès
      },
      (error) => {
        console.error("Erreur lors de l'upload du stage:", error);
        this.isUploading = false; // Réactiver le bouton en cas d'erreur
      }
    );
  }


  // Méthode pour récupérer la lettre d'affectation d'un stage
  downloadLettre(id: number): void {
    this.stageService.getLettreAffectation(id).subscribe(
      (data) => {
        const fileURL = URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = 'lettre_affectation.pdf'; // Nom du fichier PDF à télécharger
        link.click();
      },
      (error) => {
        console.error('Erreur lors de la récupération de la lettre:', error);
      }
    );
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

  // Charger le stage de l'utilisateur
  loadUserStage(): void {
    this.stageService.getStageByUser().subscribe(
      (stage) => {
        this.userStage = stage;
      },
      (error) => {
        console.error('Erreur lors du chargement du stage de l\'utilisateur:', error);
      }
    );
  }



  // Méthode pour rediriger vers le profil de l'utilisateur
  goToProfile() {
    if (this.currentUser) {
      console.log('Redirection vers /profile');
      this.router.navigate(['/profile']);
    }
  }

  downloadJournal() {
    this.stageService.downloadJournal().subscribe((response) => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Journal_de_Stage.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, (error) => {
      console.error('Erreur lors du téléchargement du journal:', error);
    });
  }

  downloadDemandeStage(id: number): void {
    this.stageService.genererDemandeStage(id).subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'demande_stage.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Erreur lors du téléchargement de la demande de stage:', error);
      }
    );
  }



}