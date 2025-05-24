import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entreprise } from './entreprise.model';
import { Offre } from '../offres/offre.model';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EntreprisesService {
  private apiUrl = 'http://localhost:8088/entreprise'; 
  private aisuggest = 'http://127.0.0.1:5000/ai-company-info';

  constructor(
    private http: HttpClient,
    private authService: AuthService // <-- Injecte AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log("Token récupéré : ", token);  // Debug
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  createEntreprise(entreprise: Entreprise): Observable<Entreprise> {
    const headers = this.getAuthHeaders();
    const newEntreprise = { ...entreprise, idEntreprise: null, version: 0 };
    return this.http.post<Entreprise>(`${this.apiUrl}/ajouter`, newEntreprise, { headers });
  }
  getAllEntreprises(): Observable<Entreprise[]> {
    return this.http.get<Entreprise[]>(`${this.apiUrl}/list`);
  }

  // Retrieve a single Entreprise by ID
  getEntrepriseById(id: number): Observable<Entreprise> {
    return this.http.get<Entreprise>(`${this.apiUrl}/list/${id}`);
  }

getCompetencesStats(entrepriseId: number): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/competences/${entrepriseId}`);
  }
  // Update an existing Entreprise
  updateEntreprise(Entreprise: Entreprise): Observable<Entreprise> {
    return this.http.put<Entreprise>(`${this.apiUrl}/update`, Entreprise);
  }

  // Delete an Entreprise
  deleteEntreprise(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
  
  getOffresByEntreprise(id: number): Observable<Offre[]> {
    return this.http.get<Offre[]>(`${this.apiUrl}/fetchoffers/${id}`);
  }
  getCompanyInfo(companyName: string): Observable<any> {
    return this.http.get<any>(`${this.aisuggest}?name=${encodeURIComponent(companyName)}`);
  }
} 