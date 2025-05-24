import { Injectable } from '@angular/core';
import emailjs from 'emailjs-com';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private userId = 'C3Ed5of--ThWhTHvM';

  constructor() {}

  sendEmail(candidateName: string, candidateEmail: string, message: string) {
    const templateParams = {
      from_name: candidateName,
      from_email: candidateEmail,
      message: message,
    };

    emailjs.send('service_lgiw0zq', 'template_6doohr9', templateParams, this.userId) 
      .then(
        (response) => {
          console.log('Email successfully sent!', response);
        },
        (error) => {
          console.error('Failed to send email:', error);
        }
      );
  }
}
