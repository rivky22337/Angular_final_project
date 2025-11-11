import { inject, Injectable } from '@angular/core';
import { Gift } from '../models/gift.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GiftsService {
    http: HttpClient = inject(HttpClient);
    BASE_URL='https://localhost:44356/api/Gifts';


  constructor() { }
getGifts():Observable<Gift[]>  {
    return this.http.get<Gift[]>(this.BASE_URL);
}

getById(id: number): Observable<Gift[]>{
  return this.http.get<Gift[]>(this.BASE_URL + '/' + id);
}

update(id:string, gift : Gift): Observable<Gift[]> {
  return this.http.put<Gift[]>(this.BASE_URL +'/'+ id, gift);
}

add(gift : Gift): Observable<Gift>{
  return this.http.post<Gift>(this.BASE_URL, gift);
}

delete(id: string){
  return this.http.delete(this.BASE_URL +'/'+ id);
}
}

