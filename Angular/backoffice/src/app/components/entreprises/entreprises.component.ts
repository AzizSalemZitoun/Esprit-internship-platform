import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { EntreprisesService } from './entreprise.service';
import { Entreprise } from './entreprise.model';

@Component({
  selector: 'app-entreprisedefault',
  templateUrl: './entreprises.component.html',
  styleUrls: ['./entreprises.component.css']
})
export class EntreprisedefaultComponent implements OnInit {
  entreprises: Entreprise[] = []; // All entreprises
  filteredEntreprises: Entreprise[] = []; // Filtered entreprises
  searchNom: string = ''; // Search by nom
  searchRepresentative: string = ''; // Search by representative
  searchAdress: string = ''; // Search by adress

  constructor(
    private router: Router, // Inject Router
    private entreprisesService: EntreprisesService // Inject EntreprisesService
  ) { }

  ngOnInit(): void {
    this.loadEntreprises();
  }

  // Load all entreprises
  loadEntreprises(): void {
    this.entreprisesService.getAllEntreprises().subscribe({
      next: (data) => {
        this.entreprises = data; // Assign fetched entreprises to the array
        this.filteredEntreprises = data; // Initialize filteredEntreprises with all entreprises
      },
      error: (e) => console.error(e)
    });
  }

  // Filter entreprises based on search criteria
  filterEntreprises(): void {
    this.filteredEntreprises = this.entreprises.filter((entreprise) => {
      const matchesNom = entreprise.nom.toLowerCase().includes(this.searchNom.toLowerCase());
      const matchesRepresentative = entreprise.representative.toLowerCase().includes(this.searchRepresentative.toLowerCase());
      const matchesAdress = entreprise.adress.toLowerCase().includes(this.searchAdress.toLowerCase());
      return matchesNom && matchesRepresentative && matchesAdress;
    });
  }

  // Navigate to modifier (edit) page with the selected entreprise
  navigateToModifier(entreprise: Entreprise): void {
    const navigationExtras: NavigationExtras = {
      state: {
        entreprise: entreprise // Pass the entire entreprise object
      }
    };
    this.router.navigate(['/entreprise/modifier'], navigationExtras); // Navigate to modifier page
  }

  // Edit an entreprise
  editEntreprise(entreprise: Entreprise): void {
    console.log('Edit Entreprise:', entreprise);
    this.navigateToModifier(entreprise);
  }

  // Delete an entreprise
  deleteEntreprise(id: number | null): void {
    if (id === null) {
      console.error('Entreprise ID is null. Cannot delete.');
      return;
    }

    if (confirm('Are you sure you want to delete this entreprise?')) {
      this.entreprisesService.deleteEntreprise(id).subscribe({
        next: () => {
          this.entreprises = this.entreprises.filter(entreprise => entreprise.idEntreprise !== id);
          this.filteredEntreprises = this.filteredEntreprises.filter(entreprise => entreprise.idEntreprise !== id); // Also remove from filteredEntreprises
          this.router.navigate(['/entreprise']);
        },
        error: (e) => console.error(e)
      });
    }
  }
}