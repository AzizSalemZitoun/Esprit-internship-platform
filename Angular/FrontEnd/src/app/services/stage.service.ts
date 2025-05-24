// src/app/stage.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class StageService {
  private apiUrl = 'http://localhost:8088/api/stage'; // URL de l'API Spring Boot

  constructor(private http: HttpClient,private router: Router) {}

  // Méthode pour télécharger un fichier et créer un stage
  uploadStage(ownedBy: string, description: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('ownedBy', ownedBy);
    formData.append('description', description);
    formData.append('file', file);

    const token = localStorage.getItem('token'); // Récupérer le token JWT
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.apiUrl}/uploadFile`, formData, { headers }).pipe(
      catchError((error) => {
        console.error('Erreur lors de l\'upload du stage:', error);
        return throwError(error);
      })
    );
  }

  // Méthode pour récupérer la lettre d'affectation
  getLettreAffectation(id: number): Observable<Blob> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/lettre/${id}`, { headers, responseType: 'blob' }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération de la lettre:', error);
        if (error.status === 401) {
          // Rediriger vers la page de connexion en cas d'erreur 401
          this.router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }
   // Méthode pour récupérer la liste des stages
   getStages(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any[]>(`${this.apiUrl}/getStages`, { headers });
  }
  getStageByUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.apiUrl}/user`, { headers }).pipe(
      catchError((error) => {
        console.error('Erreur lors du chargement du stage de l\'utilisateur:', error);
        return throwError(error);
      })
    );
  }

    // Méthode pour supprimer un stage
    deleteStage(id: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/${id}`);
    }

    downloadJournal(): Observable<Blob> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.get(`${this.apiUrl}/downloadJournal`, { headers, responseType: 'blob' });
    }


    // Méthode pour générer la demande de stage en PDF
    genererDemandeStage(id: number): Observable<Blob> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.get(`${this.apiUrl}/demande-stage/${id}`, { headers, responseType: 'blob' }).pipe(
        catchError((error) => {
          console.error('Erreur lors de la génération de la demande de stage:', error);
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
          return throwError(error);
        })
      );
    }

    getStageFile(stageId: number): Observable<Blob> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.get(`${this.apiUrl}/download/${stageId}`, { headers, responseType: 'blob' });
    }



}
