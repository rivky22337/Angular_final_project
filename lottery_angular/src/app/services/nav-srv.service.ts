import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavService {

  cartBadge = signal<number>(0);
  logoutS = signal<boolean>(false);
  admin = signal<boolean>(false);


  updateLogoutS(newValue: boolean) {
    this.logoutS.set(newValue); 
  }
  updateCartBadge(newValue: number) {
    this.cartBadge.set(newValue); 
  }
  updateAdmin(newValue: boolean) {
    this.admin.set(newValue); 
  }
}
