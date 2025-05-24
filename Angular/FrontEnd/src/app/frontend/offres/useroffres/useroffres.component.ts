import { Component, OnInit } from '@angular/core';
import { OffresService } from '../offres.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-useroffre',
  templateUrl: './useroffres.component.html',
  styleUrls: ['./useroffres.component.css']
})
export class UseroffreComponent implements OnInit {
  offres: any[] = [];
  filteredOffres: any[] = [];
  searchTitre: string = '';
  searchType: string = '';
  selectedCompetences: string[] = [];

  types: string[] = ['PFA', 'PFE'];
  availableCompetences: string[] = ['Java', 'Spring', 'Symfony', 'Javascript', 'Python'];

  constructor(
    private offreservice: OffresService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchOffres();
    this.loadUserId();
  }

  fetchOffres(): void {
    this.offreservice.getAllOffres().subscribe({
      next: (data) => {
        this.offres = data;
        this.filteredOffres = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des offres :', error);
      }
    });
  }

  toggleCompetence(competence: string): void {
    const index = this.selectedCompetences.indexOf(competence);
    if (index === -1) {
      this.selectedCompetences.push(competence);
    } else {
      this.selectedCompetences.splice(index, 1);
    }
    this.filterOffres();
  }

  generateQrCodeUrl(entrepriseId: number): string {
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://localhost:4200/entreprise/entreprisedetails/${entrepriseId}`;
  }

  filterOffres(): void {
    this.filteredOffres = this.offres.filter((offre) => {
      const matchesTitre = offre.titre.toLowerCase().includes(this.searchTitre.toLowerCase());
      const matchesType = this.searchType ? offre.type === this.searchType : true;
      const matchesCompetences = this.selectedCompetences.length > 0
        ? this.selectedCompetences.every(comp => offre.competences.includes(comp))
        : true;
      return matchesTitre && matchesType && matchesCompetences;
    });
  }

  postuler(offreId: number): void {
    const userIdString = localStorage.getItem('userId');

    if (!offreId || !userIdString) {
      console.error('❌ offreId ou userId manquant');
      return;
    }

    const userId = Number(userIdString);
    console.log('📤 Postuler à offre', offreId, 'avec user', userId);

    this.offreservice.postuler(offreId, userId).subscribe({
      next: (message) => alert(message),
      error: (err) => console.error('❌ Erreur postuler :', err)
    });
  }

  private loadUserId(): void {
    const userId = localStorage.getItem('userId');
    if (userId) return;

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.email) {
      console.error('❌ Utilisateur non authentifié');
      return;
    }

    const email = currentUser.email;
    this.http.get<number>(`http://localhost:8089/api/utilisateur/id/${email}`).subscribe({
      next: (id) => {
        localStorage.setItem('userId', id.toString());
        console.log('✅ userId récupéré et stocké :', id);
      },
      error: (err) => {
        console.error('❌ Impossible de récupérer userId depuis email :', err);
      }
    });
  }
}
