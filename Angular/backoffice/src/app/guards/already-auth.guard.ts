import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // adapte le chemin si besoin

@Injectable({
  providedIn: 'root'
})
export class AlreadyAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      // Si l'utilisateur est déjà connecté, rediriger vers l'accueil
      this.router.navigate(['/']);
      return false;
    }
    return true; // Laisser accéder à /login ou /register
  }
}
