import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReponseService } from 'src/app/services/reponse.service';

@Component({
  selector: 'app-reponse-dialog',
  templateUrl: './reponse-dialog.component.html',
  styleUrls: ['./reponse-dialog.component.css']
})
export class ReponseDialogComponent {
  message: string = '';

  constructor(
    public dialogRef: MatDialogRef<ReponseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { reclamationId: number },
    private reponseService: ReponseService
  ) {}

  envoyerReponse(): void {
    this.reponseService.envoyerReponse(this.data.reclamationId, this.message).subscribe({
      next: (response) => {
        console.log('Réponse envoyée:', response);
        this.dialogRef.close(true); // Ferme la popup avec succès
      },
      error: (error) => {
        console.error('Erreur lors de l\'envoi de la réponse:', error);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
