import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.token = this.route.snapshot.queryParams['token']; // Récupère le token depuis l'URL
  }

  resetPassword() {
    if (!this.newPassword || !this.confirmPassword) {
      this.toastr.error('Veuillez remplir tous les champs.', 'Erreur ❌', {
        positionClass: 'toast-top-center'
      });
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.toastr.error('Les mots de passe ne correspondent pas.', 'Erreur ❌', {
        positionClass: 'toast-top-center'
      });
      return;
    }

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.toastr.success('Votre mot de passe a été réinitialisé avec succès.', 'Succès ✅', {
          positionClass: 'toast-top-center'
        });
        this.router.navigate(['/signin']);
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Une erreur est survenue. Veuillez réessayer.', 'Erreur ❌', {
          positionClass: 'toast-top-center'
        });
      }
    });
  }
}
