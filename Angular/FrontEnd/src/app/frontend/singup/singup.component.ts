import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.css']
})
export class SingupComponent {
  signupRequest = {
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: '',
    competences: [] as string[]
  };

  confirmPassword: string = '';
  passwordMismatch: boolean = false;
  competences = ['Java', 'Spring Boot', 'Angular', 'Python', 'SQL', 'Docker', 'Machine Learning'];

  currentStep: number = 1; // Étape 1 par défaut
  progress: number = 0; // Progression

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {}

  onRoleChange() {
    if (this.signupRequest.role !== 'ETUDIANT') {
      this.signupRequest.competences = [];
    }
  }

  toggleCompetence(competence: string) {
    const index = this.signupRequest.competences.indexOf(competence);
    if (index === -1) {
      this.signupRequest.competences.push(competence);
    } else {
      this.signupRequest.competences.splice(index, 1);
    }
  }

  nextStep() {
    this.passwordMismatch = this.signupRequest.password !== this.confirmPassword;
    if (this.passwordMismatch) {
      this.toastr.warning('⚠️ Les mots de passe ne correspondent pas !', 'Avertissement');
      return;
    }

    if (this.signupRequest.role === 'ETUDIANT') {
      this.currentStep = 2;
      this.progress = 50;
    } else {
      this.signup();
    }
  }

  previousStep() {
    this.currentStep = 1;
    this.progress = 0;
  }

  signup() {
    this.passwordMismatch = this.signupRequest.password !== this.confirmPassword;
    if (this.passwordMismatch) {
      this.toastr.warning('⚠️ Les mots de passe ne correspondent pas !', 'Avertissement');
      return;
    }

    this.http.post('http://localhost:8088/api/auth/signup', this.signupRequest)
      .subscribe(
        response => {
          this.toastr.success('Utilisateur inscrit avec succès', 'Succès');
          this.router.navigate(['/signin']);
        },
        error => {
          this.toastr.error('Erreur lors de l’inscription', 'Erreur');
        }
      );
  }
}