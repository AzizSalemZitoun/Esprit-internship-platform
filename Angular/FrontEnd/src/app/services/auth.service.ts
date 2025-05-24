import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8088/api/auth'; // URL de votre backend
  private currentUser: { nom: string, prenom: string, email: string, role: string } | null = null;

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromLocalStorage(); // Charger l'utilisateur depuis le localStorage lors de l'initialisation
  }

  private loadUserFromLocalStorage(): void {
    const token = localStorage.getItem('token');
    if (token) {
      // Décoder le payload du JWT pour récupérer les infos de l'utilisateur
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.currentUser = {
        nom: payload.nom,
        prenom: payload.prenom,
        email: payload.sub,
        role: payload.role
      };
    }
  }

  signup(user: { nom: string, prenom: string, email: string, password: string, role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user);
  }

  signin(user: { email: string, password: string, captchaToken: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signin`, user);
  }
  
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/reset-password?token=${token}`,
      { newPassword }, // 👈 body ici
      { responseType: 'text' }
    );
  }
  




  saveToken(token: string, userNom: string, userPrenom: string, userEmail: string, userRole: string): void {
    localStorage.setItem('token', token);
    this.currentUser = { nom: userNom, prenom: userPrenom, email: userEmail, role: userRole };
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): { nom: string, prenom: string, email: string, role: string } | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser = null;
    this.router.navigate(['/signin']);
  }

  private competences: string[] = [];

  setCompetences(competences: string[]) {
    this.competences = competences;
  }

  getCompetences() {
    return this.competences;
  }
  

}
