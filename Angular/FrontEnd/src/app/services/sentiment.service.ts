import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SentimentService {
  private apiUrl = 'http://localhost:5000/analyze-sentiment';
  constructor(private http: HttpClient) {}

  analyzeSentiment(text: string) {
    return this.http.post<any>(this.apiUrl, { content: text });
  }
  
}