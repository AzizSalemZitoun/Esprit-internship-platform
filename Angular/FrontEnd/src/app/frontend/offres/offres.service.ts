import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Offre } from './offre.model';
import { Entreprise } from "../entreprise/entreprise.model";
import { Candidature } from 'src/app/candidature.model';

@Injectable({
  providedIn: 'root'
})
export class OffresService {
  private apiUrl = 'http://localhost:8088/offres'; 
  private cand ='http://localhost:8088/api/candidatures/postuler';

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
  applyForOffer(offerId: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/candidatures/postuler/${offerId}`, null, { responseType: 'text' });
  }
  postuler(offreId: number, userId: number): Observable<string> {
    return this.http.post<string>(`http://localhost:8080/api/candidatures/postuler`, null, {
      params: {
        offreId: offreId.toString(),
        userId: userId.toString()
      }
    });
  }
}