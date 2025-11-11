import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  http: HttpClient = inject(HttpClient);
  BASE_URL='https://localhost:44356/api/Mail';


  sendEmail(emailDetails: {to: string, subject: string, body: string}): Observable<any> {
    return this.http.post(this.BASE_URL, emailDetails);
  }
}
