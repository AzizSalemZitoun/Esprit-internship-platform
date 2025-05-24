import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  public baseUrl = 'http://localhost:8088/api/documents';

  constructor(private http: HttpClient) {}

  uploadDocument(candidatureId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/upload/${candidatureId}`, formData);
  }

  downloadDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}`, { responseType: 'blob' });
  }

  getDocumentsByCandidature(candidatureId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/candidature/${candidatureId}`);
  }

  getDocuments(): Observable<any[]> {
    const candidatureId = 1; 
    return this.getDocumentsByCandidature(candidatureId);
  }

  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
