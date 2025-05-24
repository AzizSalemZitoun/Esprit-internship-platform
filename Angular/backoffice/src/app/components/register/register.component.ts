import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  user = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: '',
    competences: [] as string[]
  };

  confirmPassword: string = '';
  competencesInput: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    // Vérification si tous les champs sont remplis
    if (!this.user.nom || !this.user.prenom || !this.user.email || !this.user.password || !this.confirmPassword) {
      alert("❌ Tous les champs sont obligatoires !");
      return;
    }

    // Vérification si les mots de passe correspondent
    if (this.user.password !== this.confirmPassword) {
      alert("❌ Les mots de passe ne correspondent pas !");
      return;
    }

    // Conversion de la liste de compétences
    this.user.competences = this.competencesInput
      .split(',')
      .map(c => c.trim())
      .filter(c => c);

    this.authService.signup(this.user).subscribe({
      next: () => {
        alert("✅ Inscription réussie ! Redirection en cours...");
        setTimeout(() => this.router.navigate(['/login']), 500);
      },
      error: err => {
        console.error("Erreur d'inscription:", err);

        // Vérification si err.error est défini
        let errorMessage = "❌ Échec de l'inscription. Veuillez réessayer.";
        if (err.error) {
          if (typeof err.error === 'string') {
            errorMessage = err.error; // Si le backend retourne une simple chaîne de caractères
          } else if (err.error.message) {
            errorMessage = err.error.message; // Si la réponse JSON contient un champ "message"
          }
        }

        alert(errorMessage);
      }
    });
  }
}
