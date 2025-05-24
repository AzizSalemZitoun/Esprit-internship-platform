import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './components/table/table.component';
import { HomeComponent } from './components/home/home.component';

import { BlogsComponent } from './components/blogs/blogs.component';
import { CommentsComponent } from './components/comments/comments.component';


import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { AlreadyAuthGuard } from './guards/already-auth.guard';
import { OffresComponent } from './components/offres/offres.component';
import { EntreprisedefaultComponent } from './components/entreprises/entreprises.component';
import { OffresmodifierComponent } from './components/offres/crud/offresmodifier/offresmodifier.component';
import { EntrepriseajouterComponent } from './components/entreprises/crud/entrepriseajout/entrepriseajout.component';
import { EntreprisemodifierComponent } from './components/entreprises/crud/entreprisemodifier/entreprisemodifier.component';
const routes: Routes = [
  { path: '', component: HomeComponent,canActivate: [AuthGuard]  }, // Page d'accueil
  { path: 'table', component: TableComponent },
  { path: 'login', component: LoginComponent,canActivate:[AlreadyAuthGuard]}, // Page de connexion
  { path: 'register', component: RegisterComponent,canActivate:[AlreadyAuthGuard]}, // Page d'inscription
  { path:'profile',component:ProfileComponent,canActivate:[AuthGuard]}, // Page de profil
  { path: 'profile/:id', component: ProfileComponent },
  { path: 'offres', component: OffresComponent },
  { path: 'offres/modifier/:id', component: OffresmodifierComponent },
  { path: 'entreprises', component: EntreprisedefaultComponent },
  { path: 'entreprises/ajout', component: EntrepriseajouterComponent },
  { path: 'entreprise/modifier', component: EntreprisemodifierComponent },
    { path: 'table', component: TableComponent },
  { path: 'blogs', component: BlogsComponent }, // Blogs page
  { path: 'comments', component: CommentsComponent } // Comments page

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
