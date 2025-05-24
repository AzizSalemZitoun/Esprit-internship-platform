import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StageService } from 'src/app/services/stage.service';
import { UserService } from 'src/app/services/user.service';
import { CandidatureService } from 'src/app/candidature.service';
import { Candidature } from 'src/app/candidature.module';
import { DocumentsService } from 'src/app/services/documents.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

   colorScheme = 'cool'
  // -------------------------
  // Users & Stages Properties
  // -------------------------
  users: any[] = [];
  stages: any[] = [];
  activeTab: string = 'users';

  // -----------------------------
  // Candidature Management
  // -----------------------------
  candidatures: Candidature[] = [];
  filteredCandidatures: Candidature[] = [];
  searchStatus: string = '';

  // Pagination for candidatures
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  totalPages: number = 0;

  // Sorting
  sortDirection: 'asc' | 'desc' = 'desc';

  // -----------------------------
  // Documents Management
  // -----------------------------
  documents: any[] = [];
  paginatedDocuments: any[] = [];
  searchTerm: string = '';
  docCurrentPage: number = 1;
  documentsPerPage: number = 5;
  docTotalPages: number = 0;

  chartData: any[] = [];

  constructor(
    private userService: UserService,
    private stageService: StageService,
    private candidatureService: CandidatureService,
    private documentsService: DocumentsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadStages();
    this.loadCandidatures();
    this.loadDocuments();
  }

  generateChartData(): void {
    const statusCount: { [key: string]: number } = {
      PENDING: 0,
      ACCEPTED: 0,
      REJECTED: 0
    };
  
    this.candidatures.forEach(candidature => {
      const status = candidature.statut.toUpperCase();
      if (statusCount[status] !== undefined) {
        statusCount[status]++;
      }
    });
  
    this.chartData = [
      { name: 'Pending', value: statusCount['PENDING'] },
      { name: 'Accepted', value: statusCount['ACCEPTED'] },
      { name: 'Rejected', value: statusCount['REJECTED'] }
    ];

  }
  

  // ============================
  // Users Methods
  // ============================
  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data.map(user => ({
          ...user,
          is_verified: user.verified ? 'Vérifié' : 'Non vérifié',
          is_accepted: user.accepted ? 'Accepté' : 'Non accepté'
        }));
      },
      (error) => console.error('Error loading users:', error)
    );
  }

  acceptUser(userId: number): void {
    this.userService.acceptUser(userId).subscribe(
      () => this.loadUsers(),
      (error) => console.error('Error accepting user:', error)
    );
  }

  blockUser(userId: number): void {
    this.userService.blockUser(userId).subscribe(
      () => this.loadUsers(),
      (error) => console.error('Error blocking user:', error)
    );
  }

  // ============================
  // Stages Methods
  // ============================
  loadStages(): void {
    this.stageService.getStages().subscribe(
      (stages) => this.stages = stages,
      (error) => console.error('Error loading stages:', error)
    );
  }

  editStage(id: number): void {
    this.router.navigate(['/edit-stage', id]);
  }

  copyStage(id: number): void {
    console.log(`Copied stage with ID: ${id}`);
  }

  deleteStage(id: number): void {
    if (confirm('Are you sure you want to delete this internship?')) {
      this.stageService.deleteStage(id).subscribe(
        () => this.loadStages(),
        (error) => console.error('Error deleting stage:', error)
      );
    }
  }

  downloadLettre(id: number): void {
    this.stageService.getLettreAffectation(id).subscribe(
      (response: Blob) => {
        const fileURL = URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = `lettre_affectation_${id}.pdf`;
        link.click();
      },
      (error) => console.error('Error downloading letter:', error)
    );
  }

  viewStageFile(stageId: number): void {
    this.stageService.getStageFile(stageId).subscribe(
      (fileBlob) => window.open(URL.createObjectURL(fileBlob)),
      (error) => console.error('Error viewing file:', error)
    );
  }

  // ============================
  // Candidature Methods
  // ============================
  loadCandidatures(): void {
    this.candidatureService.getAllCandidatures().subscribe(
      (data: Candidature[]) => {
        this.candidatures = data;
        this.updateFilteredCandidatures();
        this.generateChartData();
      },
      (error) => console.error('Error loading candidatures:', error)
    );
  }

  updateFilteredCandidatures(): void {
    const filtered = this.candidatures.filter(c =>
      c.statut.toLowerCase().includes(this.searchStatus.toLowerCase())
    );
    const sorted = filtered.sort((a, b) => {
      const dateA = new Date(a.datePostulation).getTime();
      const dateB = new Date(b.datePostulation).getTime();
      return this.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
    this.totalItems = sorted.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.filteredCandidatures = sorted.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  sortByDate(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.updateFilteredCandidatures();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.updateFilteredCandidatures();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateFilteredCandidatures();
    }
  }

  deleteCandidature(id: number): void {
    this.candidatureService.deleteCandidature(id).subscribe(
      () => {
        this.candidatures = this.candidatures.filter(c => c.id !== id);
        this.updateFilteredCandidatures();
      },
      (error) => console.error('Error deleting candidature:', error)
    );
  }

  // ============================
  // Documents Methods
  // ============================
  loadDocuments(): void {
    this.documentsService.getDocuments().subscribe(
      (data: any[]) => {
        this.documents = data.map(doc => ({
          ...doc,
          candidatureId: doc.candidatureId || doc.candidature_id || (doc.candidature ? doc.candidature.id : null)
        }));
        this.updatePaginatedDocuments();
      },
      (error) => console.error('Error loading documents:', error)
    );
  }

  updatePaginatedDocuments(): void {
    const filteredDocs = this.documents.filter(doc =>
      doc.fileName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.docTotalPages = Math.ceil(filteredDocs.length / this.documentsPerPage);
    const startIndex = (this.docCurrentPage - 1) * this.documentsPerPage;
    this.paginatedDocuments = filteredDocs.slice(startIndex, startIndex + this.documentsPerPage);
  }

  onDocumentSearchChange(): void {
    this.docCurrentPage = 1;
    this.updatePaginatedDocuments();
  }

  changeDocumentPage(page: number): void {
    if (page >= 1 && page <= this.docTotalPages) {
      this.docCurrentPage = page;
      this.updatePaginatedDocuments();
    }
  }

  download(docId: number): void {
    this.documentsService.downloadDocument(docId).subscribe(
      (response: Blob) => {
        const fileURL = URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = fileURL;
        link.download = `document_${docId}.pdf`;
        link.click();
      },
      (error) => console.error('Error downloading document:', error)
    );
  }

  delete(docId: number): void {
    if (confirm('Are you sure you want to delete this document?')) {
      this.documentsService.deleteDocument(docId).subscribe(
        () => {
          this.documents = this.documents.filter(doc => doc.id !== docId);
          this.updatePaginatedDocuments();
        },
        (error) => console.error('Error deleting document:', error)
      );
    }
  }
}
