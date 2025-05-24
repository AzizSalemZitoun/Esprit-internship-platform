import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'backoffice';
  showSidebar = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Définir les routes sans sidebar
        const hideSidebarRoutes = ['/login', '/register', '/forgot-password'];
        const dynamicProfileRegex = /^\/profile\/\d+$/; // pour détecter /profile/8, /profile/12 etc.

        if (
          hideSidebarRoutes.includes(event.url) ||
          dynamicProfileRegex.test(event.url)
        ) {
          this.showSidebar = false;
        } else {
          this.showSidebar = true;
        }
      }
    });
  }
}
