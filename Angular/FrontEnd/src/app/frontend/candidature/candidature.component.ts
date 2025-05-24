import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { CandidatureService } from 'src/app/candidature.service';
import { Candidature } from 'src/app/candidature.model';
import { CandidatureContextService } from 'src/app/services/candidature-context-service.service';
import { EmailService } from 'src/app/email.service';
import { environment } from 'src/app/environments/environments';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-candidature',
  templateUrl: './candidature.component.html',
  styleUrls: ['./candidature.component.css']
})
export class CandidatureComponent implements OnInit {
  errorMessage = '';
  candidatures: Candidature[] = [];
  filteredCandidatures: Candidature[] = [];
  newCandidature: Partial<Candidature> = {
    internshipOfferId: 0,
    statut: 'PENDING'
  };

  searchStatus = '';
  currentPage = 1;
  itemsPerPage = 5;
  totalItems = 0;
  totalPages = 0;
  sortDirection: 'asc' | 'desc' = 'desc';

  @ViewChild('chatBody') private chatBody!: ElementRef;
  chatOpen = false;
  userInput = '';
  messages: ChatMessage[] = [];
  now = new Date();

  private apiUrl = 'http://localhost:8088/api';

  constructor(
    private candidatureService: CandidatureService,
    private candidatureContextService: CandidatureContextService,
    private router: Router,
    private emailService: EmailService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadCandidatures();
    this.addBotMessage(`Hi! I'm your assistant. I can help with candidatures and document management.`);
  }


  loadCandidatures(): void {
    this.candidatureService.getAllCandidatures().subscribe({
      next: data => {
        this.errorMessage = '';
        this.candidatures = data;
        this.updateFilteredCandidatures();
      },
      error: err => {
        console.error('Error fetching candidatures:', err);
        this.errorMessage = 'Failed to load candidatures. Please try again later.';
      }
    });
  }

  createCandidature(): void {
    this.candidatureService.createCandidature(this.newCandidature).subscribe({
      next: data => {
        this.errorMessage = '';
        this.candidatures.unshift(data);
        this.updateFilteredCandidatures();
        this.emailService.sendEmail(
          data.studentId.toString(),
          'depressed.stoat.mosk@letterguard.net',
          'Une nouvelle candidature a été soumise.'
        );
        this.newCandidature = {
          id: 0,
          studentId: 0,
          internshipOfferId: 0,
          datePostulation: new Date(),
          statut: 'PENDING'
        };
      },
      error: err => {
        console.error('Error creating candidature:', err);
        this.errorMessage = 'Failed to create candidature. Please try again later.';
      }
    });
  }

  deleteCandidature(id: number): void {
    if (!confirm('Are you sure you want to delete this candidature?')) return;
    this.candidatureService.deleteCandidature(id).subscribe({
      next: () => {
        this.errorMessage = '';
        this.candidatures = this.candidatures.filter(c => c.id !== id);
        this.updateFilteredCandidatures();
      },
      error: err => {
        console.error('Error deleting candidature:', err);
        this.errorMessage = 'Failed to delete candidature. Please try again later.';
      }
    });
  }

  goToUploadPage(candidatureId: number): void {
    this.candidatureContextService.setCandidatureId(candidatureId);
    this.router.navigate([`/documents/${candidatureId}`]);
  }


  onSearch(): void {
    this.currentPage = 1;
    this.updateFilteredCandidatures();
  }

  sortByDate(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.updateFilteredCandidatures();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateFilteredCandidatures();
  }

  private updateFilteredCandidatures(): void {
    let list = this.candidatures.filter(c =>
      c.statut.toLowerCase().includes(this.searchStatus.toLowerCase())
    );
    list = list.sort((a, b) => {
      const da = new Date(a.datePostulation).getTime();
      const db = new Date(b.datePostulation).getTime();
      return this.sortDirection === 'asc' ? da - db : db - da;
    });
    this.totalItems = list.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredCandidatures = list.slice(start, start + this.itemsPerPage);
  }


  toggleChat() {
    this.chatOpen = !this.chatOpen;
    if (this.chatOpen) setTimeout(() => this.scrollToBottom(), 50);
  }

  sendMessage() {
    const msg = this.userInput.trim();
    if (!msg) return;

    this.addUserMessage(msg);
    this.userInput = '';

    const domainKeywords = ['candidature', 'application', 'offer', 'internship', 'document', 'upload', 'delete', 'create', 'file'];
    const inScope = domainKeywords.some(k => msg.toLowerCase().includes(k));

    if (!inScope) {
      this.addBotMessage("Sorry, I can only help with candidature and document-related questions.");
      return;
    }

    this.generateBotResponse(msg).subscribe(resp => {
      if (resp) this.addBotMessage(resp);
    });
  }

  private generateBotResponse(message: string): Observable<string> {
    const headers = {
      'Content-Type': 'application/json'
    };
  
    const body = { message: message };
  
    return this.http.post<any>(environment.openaiApiUrl, body, { headers }).pipe(
      map(response => {
        // Handle direct database responses
        if (response.response) {
          return response.response;
        }
        
        // Handle Gemini responses
        if (response.candidates) {
          return response.candidates[0]?.content?.parts[0]?.text?.trim() || 'No AI response';
        }
        
        // Handle error responses
        return response.error?.details || 'Sorry, no response received.';
      }),
      catchError(err => {
        console.error('Bot API error:', err);
        return of(err.error?.error || 'Sorry, something went wrong.');
      })
    );
  }

  private addUserMessage(text: string) {
    this.now = new Date();
    this.messages.push({ sender: 'user', text });
    this.scrollToBottom();
  }

  private addBotMessage(text: string) {
    this.now = new Date();
    this.messages.push({ sender: 'bot', text });
    this.scrollToBottom();
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.chatBody?.nativeElement) {
        this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
      }
    }, 100);
  }
}
