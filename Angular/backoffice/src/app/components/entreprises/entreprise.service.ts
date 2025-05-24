import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entreprise } from './entreprise.model';

@Injectable({
  providedIn: 'root'
})
export class EntreprisesService {
  private apiUrl = 'http://localhost:8089/stage/entreprise'; 

  constructor(private http: HttpClient) {}

  createEntreprise(Entreprise: Entreprise): Observable<Entreprise> {
    const newEntreprise = { ...Entreprise, idEntreprise: null, version: 0 };
    return this.http.post<Entreprise>(`${this.apiUrl}/ajouter`, newEntreprise);
  }
  getAllEntreprises(): Observable<Entreprise[]> {
    return this.http.get<Entreprise[]>(`${this.apiUrl}/list`);
  }

  // Retrieve a single Entreprise by ID
  getEntrepriseById(id: number): Observable<Entreprise> {
    return this.http.get<Entreprise>(`${this.apiUrl}/list/${id}`);
  }

  // Update an existing Entreprise
  updateEntreprise(Entreprise: Entreprise): Observable<Entreprise> {
    return this.http.put<Entreprise>(`${this.apiUrl}/update`, Entreprise);
  }

  // Delete an Entreprise
  deleteEntreprise(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
} 