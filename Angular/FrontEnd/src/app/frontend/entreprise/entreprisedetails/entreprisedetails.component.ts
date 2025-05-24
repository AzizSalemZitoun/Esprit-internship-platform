import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EntreprisesService } from '../entreprise.service';
import { Entreprise } from '../entreprise.model';
import Chart from 'chart.js/auto'; // Import Chart.js

@Component({
  selector: 'app-entreprise-details',
  templateUrl: './entreprisedetails.component.html',
  styleUrls: ['./entreprisedetails.component.css']
})
export class EntrepriseDetailsComponent implements OnInit {
  entreprise: Entreprise | undefined; // Holds the fetched enterprise data
  isLoading = true; // Loading state
  error: string | null = null; // Error message
  private chart: any; // Chart instance

  constructor(
    private route: ActivatedRoute,
    private entreprisesService: EntreprisesService // Inject the service
  ) {}

  ngOnInit(): void {
    // Extract the 'id' from the route
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // Convert the id to a number (since your API expects a number)
      const enterpriseId = +id;

      // Fetch the enterprise data using the service
      this.entreprisesService.getEntrepriseById(enterpriseId).subscribe({
        next: (data) => {
          this.entreprise = data; // Assign the fetched data
          this.isLoading = false; // Set loading to false

          // Fetch competences stats for the enterprise
          this.fetchCompetencesStats(enterpriseId);
        },
        error: (err) => {
          this.error = 'Failed to load enterprise details.'; // Set error message
          this.isLoading = false; // Set loading to false
          console.error(err); // Log the error
        }
      });
    } else {
      this.error = 'Invalid enterprise ID.'; // Set error message if no ID is found
      this.isLoading = false; // Set loading to false
    }
  }

  // Fetch competences stats for the enterprise
  fetchCompetencesStats(entrepriseId: number): void {
    this.entreprisesService.getCompetencesStats(entrepriseId).subscribe({
      next: (stats) => {
        // Create the chart with the fetched stats
        this.createChart(stats);
      },
      error: (err) => {
        console.error('Failed to fetch competences stats:', err);
      }
    });
  }

  // Create the chart
  createChart(stats: { [key: string]: number }): void {
    const competences = Object.keys(stats); // Get competences names
    const frequencies = Object.values(stats); // Get competences frequencies

    // Define an array of colors for each pie slice
    const backgroundColors = [
        '#d32f2f', // Red
        '#1976d2', // Blue
        '#388e3c', // Green
        '#fbc02d', // Yellow
        '#7b1fa2', // Purple
        '#ff5722', // Orange
        '#0097a7', // Cyan
        '#c2185b', // Pink
        '#5d4037', // Brown
        '#455a64'  // Gray
    ];

    this.chart = new Chart('competencesChart', {
        type: 'pie', // Change chart type to pie
        data: {
            labels: competences, // Labels for each pie slice (competences)
            datasets: [
                {
                    label: 'nombres des offres',
                    data: frequencies, // Data for each pie slice (frequencies)
                    backgroundColor: backgroundColors, // Assign colors to pie slices
                    borderColor: '#ffffff', // Border color for pie slices
                    borderWidth: 2 // Border width for pie slices
                }
            ]
        },
        options: {
          responsive: true, // Make the chart responsive
          maintainAspectRatio: true, // Disable aspect ratio to control size
          aspectRatio: 1.5,
            plugins: {
                legend: {
                    position: 'top', 
                },
                tooltip: {
                    enabled: true 
                }
            }
        }
    });
  }
}