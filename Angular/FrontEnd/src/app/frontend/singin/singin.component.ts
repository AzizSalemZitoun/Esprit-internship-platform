import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-singin',
  templateUrl: './singin.component.html',
  styleUrls: ['./singin.component.css']
})
export class SinginComponent {
  email: string = '';
  password: string = '';
  captchaToken: string = ''; // 🧩 Nouveau champ pour le token reCAPTCHA
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onCaptchaResolved(token: string | null) {
    this.captchaToken = token ?? ''; // si `null`, on met ''
    console.log("Captcha résolu :", token);
  }
  

  signin() {
    if (!this.email || !this.password) {
      this.toastr.error('Veuillez remplir tous les champs.', 'Erreur ❌', {
        positionClass: 'toast-top-center'
      });
      return;
    }

    if (!this.captchaToken) {
      this.toastr.error('Veuillez valider le CAPTCHA.', 'Erreur ❌', {
        positionClass: 'toast-top-center'
      });
      return;
    }

    const user = {
      email: this.email,
      password: this.password,
      captchaToken: this.captchaToken
    };

    this.authService.signin(user).subscribe({
      next: (response: any) => {
        const token = response.token;
        const payload = JSON.parse(atob(token.split('.')[1]));

        const userNom = payload.nom;
        const userPrenom = payload.prenom;
        const userEmail = payload.sub;
        const userRole = payload.role;

        this.authService.saveToken(token, userNom, userPrenom, userEmail, userRole);
        console.log('Token reçu:', token);

        this.toastr.success(`Bienvenue, ${userPrenom} ${userNom} !`, 'Connexion réussie ✅', {
          positionClass: 'toast-top-center'
        });

        this.router.navigate(['/home']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erreur de connexion:', err);
        let errorMessage = 'Erreur de connexion. Veuillez vérifier vos identifiants.';

        if (err.status === 403) {
          errorMessage = "Votre compte n'a pas encore été vérifié. Veuillez vérifier votre email.";
          this.toastr.warning(errorMessage, 'Avertissement ⚠️', {
            positionClass: 'toast-top-center'
          });
        } else if (err.status === 400) {
          if (typeof err.error === 'string') {
            errorMessage = err.error;
          } else if (err.error && err.error.message) {
            errorMessage = err.error.message;
          }
        } else if (err.status >= 500) {
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
        } else if (err.status === 0) {
          errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
        }

        this.errorMessage = errorMessage;

        if (err.status !== 403) {
          this.toastr.error(errorMessage, 'Erreur ❌', {
            positionClass: 'toast-top-center'
          });
        }
      }
    });
  }

  forgotPassword() {
    if (!this.email) {
      this.toastr.error('Veuillez entrer votre email.', 'Erreur ❌', {
        positionClass: 'toast-top-center'
      });
      return;
    }

    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.toastr.success('Un email de réinitialisation a été envoyé.', 'Succès ✅', {
          positionClass: 'toast-top-center'
        });
      },
      error: (err) => {
        this.toastr.error('Une erreur est survenue. Vérifiez votre email.', 'Erreur ❌', {
          positionClass: 'toast-top-center'
        });
      }
    });
  }
}