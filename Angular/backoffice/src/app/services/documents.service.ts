import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  private baseUrl = 'http://localhost:8080/api/documents';

  constructor(private http: HttpClient) {}

  // 🔹 Upload d'un document pour une candidature donnée
  uploadDocument(candidatureId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/upload/${candidatureId}`, formData);
  }

  // 🔹 Téléchargement d'un document par son ID
  downloadDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}`, { responseType: 'blob' });
  }

  // 🔹 Récupération des documents pour une candidature donnée
  getDocumentsByCandidature(candidatureId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/candidature/${candidatureId}`);
  }

  // 🔹 Méthode pour récupérer la liste des documents (exemple avec candidatureId = 1)
  getDocuments(): Observable<any[]> {
    return this.getAllDocuments();
  }
  // 🔹 Récupération de tous les documents (sans filtrage par candidature)
getAllDocuments(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/all`);
}

  

  // 🔹 Suppression d'un document par son ID
  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
