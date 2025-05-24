import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CandidatureContextService {
  private candidatureId: number | null = null;

  setCandidatureId(id: number): void {
    this.candidatureId = id;
  }

  getCandidatureId(): number | null {
    return this.candidatureId;
  }
}
