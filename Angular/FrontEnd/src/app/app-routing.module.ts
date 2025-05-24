import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SinginComponent } from './frontend/singin/singin.component';
import { SingupComponent } from './frontend/singup/singup.component';
import { PriceComponent } from './frontend/price/price.component';
import { BlogComponent } from './frontend/blog/blog.component';
import { AboutComponent } from './frontend/about/about.component';
import { TeamComponent } from './frontend/team/team.component';
import { HomeComponent } from './frontend/home/home.component';
import { FeatureComponent } from './frontend/feature/feature.component';
import { TestimonialComponent } from './frontend/testimonial/testimonial.component';
import { CandidatureComponent } from './frontend/candidature/candidature.component';
import { OffresajouterComponent } from './frontend/offres/crud/offresajouter.component';
import { EntrepriseajouterComponent } from './frontend/entreprise/crud/entreprise.component';
import { OffresdefaultComponent } from './frontend/offres/offredefault.component'; 
import { EntreprisedefaultComponent } from './frontend/entreprise/entreprisedefault.component';
import { OffresmodifierComponent } from './frontend/offres/crud/offresmodifier.component';
 import { UseroffreComponent } from './frontend/offres/useroffres/useroffres.component';
import { EntreprisemodifierComponent } from './frontend/entreprise/crud/entreprisemodifier.component';
import { EntrepriseDetailsComponent } from './frontend/entreprise/entreprisedetails/entreprisedetails.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { ListuserComponent } from './backend/listuser/listuser.component';
import { ProfileComponent } from './frontend/profile/profile.component';
import { StageComponent } from './frontend/stage/stage.component';

import { HeaderComponent } from './frontend/header/header.component';
import { BlogdisplComponent } from './frontend/blogdispl/blogdispl.component';
import { DisplayBComponent } from './frontend/display-b/display-b.component';



import { ReclamationComponent } from './frontend/reclamation/reclamation.component';
import { UserChartComponentComponent } from './backend/user-chart-component/user-chart-component.component';
import { ResetPasswordComponent } from './frontend/reset-password/reset-password.component';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  { path: '', component: HomeComponent,canActivate: [AuthGuard] }, // Page d'accueil
  { path: 'signin', component: SinginComponent },
  { path: 'signup', component: SingupComponent },
  { path: 'price', component: PriceComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'about', component: AboutComponent },
  { path: 'team', component: TeamComponent },
  { path: 'feature', component: FeatureComponent },
  { path: 'testimonial', component: TestimonialComponent },
  { path: 'candidature', component: CandidatureComponent},

  { path: 'header', component: HeaderComponent},
  { path: 'blogdispl', component: BlogdisplComponent},

  { path: 'offres/ajout', component: OffresajouterComponent },
  { path: 'offres', component: OffresdefaultComponent },
  { path: 'entreprise/ajout', component: EntrepriseajouterComponent },
  { path: 'entreprise', component: EntreprisedefaultComponent },
  { path: 'offres/modifier/:id', component: OffresmodifierComponent },
  { path: 'entreprise/modifier', component: EntreprisemodifierComponent },
  { path: 'useroffres', component: UseroffreComponent },
  { path: 'entreprise/entreprisedetails/:id', component: EntrepriseDetailsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'documents/:id', component: DocumentsComponent },

  { path: 'listuser', component: ListuserComponent,canActivate: [AuthGuard]},
  { path: 'profile', component: ProfileComponent,canActivate: [AuthGuard]},
  { path: 'stage', component: StageComponent,canActivate: [AuthGuard]},
  { path: 'blogdispC', component:DisplayBComponent},

  { path: 'reclamation', component: ReclamationComponent},

  { path: 'profile/:id', component: ProfileComponent },// Route du profil utilisateur


  { path: 'chart', component: UserChartComponentComponent },
  { path: 'reset-password', component: ResetPasswordComponent },



  

  { path: '**', redirectTo: '', pathMatch: 'full' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
