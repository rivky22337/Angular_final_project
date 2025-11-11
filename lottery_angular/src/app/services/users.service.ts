import { inject, Injectable } from '@angular/core';
import { User } from '../models/User.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  http: HttpClient = inject(HttpClient);
  BASE_URL='https://localhost:44356/api/Users';
  constructor() { }
  getUsers():Observable<User[]>  {
    return this.http.get<User[]>(this.BASE_URL);
}

getById(id: number): Observable<User[]>{
  return this.http.get<User[]>(this.BASE_URL + '/' + id);
}


add(user : User): Observable<User>{
  return this.http.post<User>(this.BASE_URL, user);
}

}
