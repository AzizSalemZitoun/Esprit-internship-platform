import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { ChartOptions, ChartData } from 'chart.js';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  user: any;
    selectedFile: File | null = null;
    profileImageUrl: string = '';
  
    users: any[] = [];

    roleLabels: string[] = [];
  roleData: ChartData<'bar'> = { labels: [], datasets: [{ data: [] }] };

  acceptationLabels: string[] = ['Acceptés', 'Non Acceptés'];
  acceptationData: ChartData<'pie'> = {
    labels: this.acceptationLabels,
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#4CAF50', '#FF6384'] // Vert pour acceptés, Rouge pour non acceptés
    }]
  };

  verificationLabels: string[] = ['Vérifiés', 'Non Vérifiés'];
  verificationData: ChartData<'doughnut'> = {
    labels: this.verificationLabels,
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#36A2EB', '#FFCE56'] // Bleu pour vérifiés, Jaune pour non vérifiés
    }]
  };
  
    constructor(private userService: UserService, private router: Router, private toastr: ToastrService) {}
  
    ngOnInit(): void {
      this.loadProfile();
      this.userService.getUsers().subscribe((data) => {
        console.log("Données reçues :", data); // ✅ Vérifie que les données sont bien récupérées
        this.users = data;
        console.log("Utilisateurs après affectation :", this.users); // 🛑 Vérifie si `this.users` est bien mis à jour
        this.processChartData();
      });
    }


    processChartData() {
      const roleCounts: { [key: string]: number } = {};
      let acceptedCount = 0;
      let nonAcceptedCount = 0;
      let verifiedCount = 0;
      let nonVerifiedCount = 0;
  
      this.users.forEach((user) => {
        // Vérification des rôles
        roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
  
        // Vérification de l'acceptation
        if (user.is_accepted === 1) {
          acceptedCount++;
        } else {
          nonAcceptedCount++;
        }
  
        if (user.is_verified === 1) {
          verifiedCount++;
        } else {
          nonVerifiedCount++;
        }
  
      });
  
      console.log("Acceptés:", acceptedCount, "Non Acceptés:", nonAcceptedCount); // ✅ Vérification dans la console
  
      // Mise à jour des données
      this.roleLabels = Object.keys(roleCounts);
      this.roleData = { labels: this.roleLabels, datasets: [{ data: Object.values(roleCounts) }] };
  
      this.acceptationData = {
        labels: this.acceptationLabels,
        datasets: [{
          data: [acceptedCount, nonAcceptedCount],
          backgroundColor: ['#4CAF50', '#FF6384'] // Vert et Rouge
        }]
      };
  
      this.verificationData = {
        labels: this.verificationLabels,
        datasets: [{
          data: [verifiedCount, nonVerifiedCount],
          backgroundColor: ['#36A2EB', '#FFCE56'] // Bleu et Jaune
        }]
      };
    }
  
    barChartOptions: ChartOptions = { responsive: true, maintainAspectRatio: false, aspectRatio: 2 };
    pieChartOptions: ChartOptions = { responsive: true, maintainAspectRatio: false, aspectRatio: 1.5 };

    
  
    loadProfile(): void {
      this.userService.getUserProfile().subscribe(
        (data) => {
          this.user = data;
          this.profileImageUrl = data.profilePictureUrl; // Assurez-vous que le backend retourne bien cette valeur
        },
        (error) => {
          console.error("Erreur lors du chargement du profil:", error);
        }
      );
    }
  
    onFileSelected(event: any): void {
      if (event.target.files.length > 0) {
        this.selectedFile = event.target.files[0];
      }
    }
  
    uploadProfilePicture(): void {
      if (!this.selectedFile) {
        this.toastr.error("Veuillez sélectionner une image", "Erreur ⚠️");
        return;
      }
  
      const formData = new FormData();
      formData.append("file", this.selectedFile);
  
      this.userService.uploadProfilePicture(this.user.id, formData).subscribe(
        (response) => {
          this.toastr.success("Image téléchargée avec succès 🎉", "Succès ✅");
          this.profileImageUrl = response.imageUrl; // Mettre à jour l'affichage de l'image
        },
        (error) => {
          console.error("Erreur lors de l'upload de l'image:", error);
          this.toastr.error("Erreur lors du téléchargement de l'image", "Erreur ⚠️");
        }
      );
    }
  
    logout(): void {
      this.toastr.success('Vous êtes maintenant déconnecté.', 'Déconnexion réussie ✅', {
        positionClass: 'toast-top-center'
      });
      this.router.navigate(['/signin']);
    }

    // Méthode pour naviguer vers la page de profil
  goToProfile(): void {
    this.router.navigate(['/profile', this.user.id]); // On navigue vers /profile/<user.id>
  }

  

}

