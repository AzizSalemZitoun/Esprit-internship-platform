import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  captchaToken: string = ''; // Token reCAPTCHA

  constructor(private authService: AuthService, private router: Router) {}

  // Récupération du token reCAPTCHA
  onCaptchaResolved(token: string | null): void {
    if (token) {
      this.captchaToken = token;
      console.log('reCAPTCHA résolu avec le token :', token);
    } else {
      this.captchaToken = '';
      console.warn('Le reCAPTCHA a échoué ou a expiré.');
    }
  }
  

  onSubmit(): void {
    if (!this.captchaToken) {
      alert('Veuillez valider le reCAPTCHA.');
      return;
    }

    const user = {
      email: this.email,
      password: this.password,
      captchaToken: this.captchaToken
    };

    this.authService.signin(user).subscribe({
      next: (response) => {
        const token = response.token;
        const payload = JSON.parse(atob(token.split('.')[1]));

        this.authService.saveToken(
          token,
          payload.nom,
          payload.prenom,
          payload.sub,
          payload.role
        );

        this.router.navigate(['/']); // ou /dashboard
      },
      error: (err) => {
        console.error(err);
        alert('Échec de la connexion. Vérifiez vos identifiants.');
      }
    });
  }
}
