import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableComponent } from './components/table/table.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HomeComponent } from './components/home/home.component';

import { BlogsComponent } from './components/blogs/blogs.component';
import { CommentsComponent } from './components/comments/comments.component';

import { OffresComponent } from './components/offres/offres.component';
import { EntreprisedefaultComponent } from './components/entreprises/entreprises.component';
import { OffresmodifierComponent } from './components/offres/crud/offresmodifier/offresmodifier.component';
import { EntrepriseajouterComponent } from './components/entreprises/crud/entrepriseajout/entrepriseajout.component';
import { EntreprisemodifierComponent } from './components/entreprises/crud/entreprisemodifier/entreprisemodifier.component';
import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgetpasswordComponent } from './components/forgetpassword/forgetpassword.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ProfileComponent } from './components/profile/profile.component';
import { NgChartsModule } from 'ng2-charts';
import { RecaptchaModule } from 'ng-recaptcha';



@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    SidebarComponent,
    HomeComponent,

    BlogsComponent,
    CommentsComponent

    OffresComponent,
    EntreprisedefaultComponent,
    OffresComponent,
    OffresmodifierComponent,
    EntrepriseajouterComponent,
    EntreprisemodifierComponent,
    LoginComponent,
    RegisterComponent,
    ForgetpasswordComponent,
    ProfileComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    NgChartsModule,
    RecaptchaModule,
    ToastrModule.forRoot({
      positionClass: 'toast-center-center', // Centrer le popup
      timeOut: 3000, // Disparaît après 3 secondes
      progressBar: true, // Affiche une barre de progression
      closeButton: true, // Ajoute un bouton de fermeture
      preventDuplicates: true, // Évite les messages en double
    }),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }