import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { HttpClientModule } from '@angular/common/http';
import { OffresmodifierComponent } from './frontend/offres/crud/offresmodifier.component';
import { EntreprisemodifierComponent } from './frontend/entreprise/crud/entreprisemodifier.component';
import { UseroffreComponent } from './frontend/offres/useroffres/useroffres.component';
import { EntrepriseDetailsComponent } from './frontend/entreprise/entreprisedetails/entreprisedetails.component';

import { FormsModule } from '@angular/forms';
import { DocumentsComponent } from './components/documents/documents.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Ajoute ceci !
import { HeaderComponent } from './frontend/header/header.component';
import { ToastrModule } from 'ngx-toastr';
import { ListuserComponent } from './backend/listuser/listuser.component';
import { ProfileComponent } from './frontend/profile/profile.component';

import { FooterComponent } from './frontend/footer/footer.component';
import { DisplayBComponent } from './frontend/display-b/display-b.component';
import { BlogdisplComponent } from './frontend/blogdispl/blogdispl.component';

import { UserChartComponentComponent } from './backend/user-chart-component/user-chart-component.component';
import { NgChartsModule } from 'ng2-charts';
import { ResetPasswordComponent } from './frontend/reset-password/reset-password.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { StageComponent } from './frontend/stage/stage.component';
import { ReclamationComponent } from './frontend/reclamation/reclamation.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReponseDialogComponent } from './components/reponse-dialog/reponse-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'; // Si tu utilises des boutons Angular Material


import { QRCodeComponent, QRCodeModule } from 'angularx-qrcode';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    SinginComponent,
    SingupComponent,

    PriceComponent,
    BlogComponent,
    AboutComponent,
    TeamComponent,
    HomeComponent,
    FeatureComponent,
    TestimonialComponent,
    CandidatureComponent,
    OffresajouterComponent,
EntrepriseajouterComponent,
OffresdefaultComponent,
    EntreprisedefaultComponent,
    OffresmodifierComponent,
    EntreprisemodifierComponent,
    UseroffreComponent,
    EntrepriseDetailsComponent,
   

    
    
    DocumentsComponent,
    ListuserComponent,
    ProfileComponent,

    HeaderComponent,
    FooterComponent,
    DisplayBComponent,
    BlogdisplComponent
    
    

    ReclamationComponent,
    StageComponent,
    ReclamationComponent,
    ReponseDialogComponent,

    UserChartComponentComponent,
    ResetPasswordComponent,
   


  ],
  imports: [
    FormsModule,
    AppRoutingModule,
    QRCodeModule,
    HttpClientModule,
    BrowserModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-center', // ✅ Centre les notifications
      timeOut: 3000, // Temps d'affichage (optionnel)
      closeButton: true, // Bouton pour fermer (optionnel)
      progressBar: true // Barre de progression (optionnel)
    }),// Configuration globale du Toastr
    BrowserAnimationsModule,

    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,


    NgChartsModule,
    RecaptchaModule,
    NgxPaginationModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }