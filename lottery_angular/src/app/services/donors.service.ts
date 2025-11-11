import { inject, Injectable } from '@angular/core';
import { Donor } from '../models/Donor.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DonorsService {
  http: HttpClient = inject(HttpClient);
  BASE_URL='https://localhost:44356/api/Donors';

  constructor() { }

  getDonors():Observable<Donor[]>  {
    return this.http.get<Donor[]>(this.BASE_URL);
}

getById(id: number): Observable<Donor[]>{
  return this.http.get<Donor[]>(this.BASE_URL + '/' + id);
}

update(id:string, donor : Donor): Observable<Donor[]> {
  return this.http.put<Donor[]>(this.BASE_URL +'/'+ id, donor);
}

add(donor : Donor): Observable<Donor>{
  return this.http.post<Donor>(this.BASE_URL, donor);
}

delete(id: string){
  return this.http.delete(this.BASE_URL +'/'+ id);
}
}
