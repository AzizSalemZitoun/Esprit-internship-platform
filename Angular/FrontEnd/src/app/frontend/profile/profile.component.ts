import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  user: any;
  selectedFile: File | null = null;
  profileImageUrl: string = '';

  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

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
}