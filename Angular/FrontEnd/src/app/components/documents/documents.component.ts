import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentsService } from '../../services/documents.service';
import { CandidatureContextService } from 'src/app/services/candidature-context-service.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  documents: any[] = [];
  paginatedDocuments: any[] = [];
  selectedFile: File | null = null;
  fileError: boolean = false;
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  documentsPerPage: number = 5;
  candidatureId: number | null = null;

  constructor(
    private documentsService: DocumentsService,
    private route: ActivatedRoute,
    private candidatureContextService: CandidatureContextService
  ) {}

  ngOnInit(): void {
    this.candidatureId = this.route.snapshot.params['candidatureId'] || this.candidatureContextService.getCandidatureId();
    this.loadDocuments();
  }

  loadDocuments(): void {
    if (this.candidatureId) {
      this.documentsService.getDocumentsByCandidature(this.candidatureId).subscribe({
        next: (data: any[]) => {
          this.documents = data;
          this.totalPages = Math.ceil(this.documents.length / this.documentsPerPage);
          this.updatePaginatedDocuments();
        },
        error: (error: any) => console.error("Erreur lors du chargement des documents", error)
      });
    }
  }

  updatePaginatedDocuments(): void {
    const filteredDocuments = this.documents.filter(doc =>
      doc.fileName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    const startIndex = (this.currentPage - 1) * this.documentsPerPage;
    this.paginatedDocuments = filteredDocuments.slice(startIndex, startIndex + this.documentsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedDocuments();
    }
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.updatePaginatedDocuments();
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.fileError = false;
    } else {
      console.error("Aucun fichier sélectionné !");
      this.selectedFile = null;
    }
  }

  uploadFile(): void {
    if (!this.selectedFile || !this.candidatureId) {
      this.fileError = true;
      console.error("Aucun fichier ou ID de candidature non valide !");
      return;
    }

    this.documentsService.uploadDocument(this.candidatureId, this.selectedFile).subscribe({
      next: (response) => {
        console.log("Upload réussi", response);
        this.selectedFile = null;
        this.loadDocuments();
      },
      error: (error: any) => {
        this.fileError = true;
        console.error("Erreur upload", error);
      }
    });
  }

  generateDownloadLink(docId: number): string {
    return `${this.documentsService.baseUrl}/${docId}`;
  }

  delete(id: number): void {
    this.documentsService.deleteDocument(id).subscribe({
      next: () => {
        console.log(`Document ${id} supprimé`);
        this.loadDocuments();
      },
      error: (error: any) => console.error("Erreur lors de la suppression", error)
    });
  }
}
