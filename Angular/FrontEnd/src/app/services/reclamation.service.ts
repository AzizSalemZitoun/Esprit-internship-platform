import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';  // Assure-toi d'importer 'tap' ici
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {
  private apiUrl = 'http://localhost:8088/api/reclamations'; // URL de l'API Spring Boot

  constructor(private http: HttpClient, private router: Router) {}

  
  
  
  // Récupérer toutes les réclamations (sans authentification)
  getAllReclamations(): Observable<any[]> {
    const token = localStorage.getItem('token'); // Récupérer le token depuis le localStorage
  
    if (!token) {
      console.error('Token manquant, utilisateur non authentifié');
      return throwError(() => new Error('Authentification requise'));
    }
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Ajout du token dans les headers
    });
  
    return this.http.get<any[]>(`${this.apiUrl}/get`, { headers }).pipe(
      tap((response) => {
        console.log('Réponse reçue:', response); // Vérifie la réponse
      }),
      catchError((error) => {
        console.error('Erreur lors du chargement des réclamations:', error);
        return throwError(() => error);
      })
    );
  }
  

  // Créer une nouvelle réclamation (sans authentification)
  createReclamation(reclamation: any): Observable<any> {
    const token = localStorage.getItem('token'); // Récupération du token depuis le localStorage
    if (!token) {
      console.error('Token manquant, utilisateur non authentifié');
      return throwError('Token manquant, utilisateur non authentifié');
    }
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Ajout du token dans l'en-tête pour authentification
    });
  
    return this.http.post<any>(`${this.apiUrl}/post`, reclamation, { headers }).pipe(
      tap(response => {
        console.log('Réclamation créée avec succès:', response);
      }),
      catchError(error => {
        console.error('Erreur lors de la création de la réclamation:', error);
        return throwError(error);
      })
    );
  }
  
  // Récupérer une réclamation par son ID (avec authentification)
  getReclamationById(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError((error) => {
        console.error('Erreur lors du chargement de la réclamation:', error);
        return throwError(error);
      })
    );
  }

  // Mettre à jour une réclamation (avec authentification)
  updateReclamation(id: number, reclamation: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put<any>(`${this.apiUrl}/${id}`, reclamation, { headers }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la mise à jour de la réclamation:', error);
        return throwError(error);
      })
    );
  }

  // Supprimer une réclamation (avec authentification)
  deleteReclamation(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la suppression de la réclamation:', error);
        return throwError(error);
      })
    );
  }

  // Récupérer les réclamations de l'utilisateur connecté
  getReclamationsByUser(): Observable<any[]> {
    const token = localStorage.getItem('token'); // Récupération du token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Ajout du token pour authentification
    });
  
    // Effectuer une requête pour obtenir les réclamations pour l'utilisateur actuel
    return this.http.get<any[]>(`${this.apiUrl}/user`, { headers }).pipe(
      catchError((error) => {
        console.error('Erreur lors du chargement des réclamations par utilisateur:', error);
        return throwError(error);
      }),
      tap((response) => {
        console.log('Réclamations par utilisateur reçues:', response); // Affiche la réponse brute
      })
    );
  }
  
   // Mettre à jour une réclamation
  

}
