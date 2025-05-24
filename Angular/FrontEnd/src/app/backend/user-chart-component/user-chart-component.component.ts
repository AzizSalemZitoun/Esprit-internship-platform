import { Component } from '@angular/core';
import { ChartOptions, ChartData } from 'chart.js';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-chart-component',
  templateUrl: './user-chart-component.component.html',
  styleUrls: ['./user-chart-component.component.css']
})
export class UserChartComponentComponent {
  users: any[] = [];

  roleLabels: string[] = [];
  roleData: ChartData<'bar'> = { labels: [], datasets: [{ data: [] }] };

  acceptationLabels: string[] = ['Acceptés', 'Non Acceptés'];
  acceptationData: ChartData<'pie'> = {
    labels: this.acceptationLabels,
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#4CAF50', '#FF6384'] // Vert pour acceptés, Rouge pour non acceptés
    }]
  };

  verificationLabels: string[] = ['Vérifiés', 'Non Vérifiés'];
  verificationData: ChartData<'doughnut'> = {
    labels: this.verificationLabels,
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#36A2EB', '#FFCE56'] // Bleu pour vérifiés, Jaune pour non vérifiés
    }]
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
      console.log("Données reçues :", data); // ✅ Vérifie que les données sont bien récupérées
      this.users = data;
      console.log("Utilisateurs après affectation :", this.users); // 🛑 Vérifie si `this.users` est bien mis à jour
      this.processChartData();
    });

  }

  processChartData() {
    const roleCounts: { [key: string]: number } = {};
    let acceptedCount = 0;
    let nonAcceptedCount = 0;
    let verifiedCount = 0;
    let nonVerifiedCount = 0;

    this.users.forEach((user) => {
      // Vérification des rôles
      roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;

      // Vérification de l'acceptation
      if (user.is_accepted === 1) {
        acceptedCount++;
      } else {
        nonAcceptedCount++;
      }

      if (user.is_verified === 1) {
        verifiedCount++;
      } else {
        nonVerifiedCount++;
      }

    });

    console.log("Acceptés:", acceptedCount, "Non Acceptés:", nonAcceptedCount); // ✅ Vérification dans la console

    // Mise à jour des données
    this.roleLabels = Object.keys(roleCounts);
    this.roleData = { labels: this.roleLabels, datasets: [{ data: Object.values(roleCounts) }] };

    this.acceptationData = {
      labels: this.acceptationLabels,
      datasets: [{
        data: [acceptedCount, nonAcceptedCount],
        backgroundColor: ['#4CAF50', '#FF6384'] // Vert et Rouge
      }]
    };

    this.verificationData = {
      labels: this.verificationLabels,
      datasets: [{
        data: [verifiedCount, nonVerifiedCount],
        backgroundColor: ['#36A2EB', '#FFCE56'] // Bleu et Jaune
      }]
    };
  }

  barChartOptions: ChartOptions = { responsive: true, maintainAspectRatio: false, aspectRatio: 2 };
  pieChartOptions: ChartOptions = { responsive: true, maintainAspectRatio: false, aspectRatio: 1.5 };
}
