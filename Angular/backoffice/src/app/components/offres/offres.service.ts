import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offre } from './offre.model';
import { Entreprise } from '../entreprises/entreprise.model';


@Injectable({
  providedIn: 'root'
})
export class OffresService {
  private apiUrl = 'http://localhost:8089/stage/offres'; 

  constructor(private http: HttpClient) {}

  createOffre(offre: Offre): Observable<Offre> {
    const newOffre = { ...offre, idOffre: null, version: 0 };
    return this.http.post<Offre>(`${this.apiUrl}/ajouter`, newOffre);
  }
  getAllOffres(): Observable<Offre[]> {
    return this.http.get<Offre[]>(`${this.apiUrl}/list`);}

  // Retrieve a single Offre by ID
  getOffreById(id: number): Observable<Offre> {
    return this.http.get<Offre>(`${this.apiUrl}/list/${id}`);
  }

  updateOffre(id: number, offre: Offre): Observable<Offre> {
    return this.http.put<Offre>(`${this.apiUrl}/update/${id}`, offre);
  }

  // Delete an Offre
  deleteOffre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}