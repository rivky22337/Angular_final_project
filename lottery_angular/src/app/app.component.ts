import { Router, RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { Button } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { NavService } from './services/nav-srv.service';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Menubar, Button, CommonModule,BadgeModule,OverlayBadgeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'final-project';
  navSrv:NavService=inject(NavService)
  userItems: MenuItem[]=[
    {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: ['']
    },
    {
      label: 'choose gifts',
      icon: 'pi pi-ticket',
      routerLink: ['chooseGifts'] // נתיב לדף יצירת קשר
    }
  ]

  adminItems:MenuItem[]=[
    {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: ['']
    },
    {
      label: 'Gifts',
      icon: 'pi pi-gift',
      routerLink: ['gifts']
    },
    {
      label: 'donors',
      icon: 'pi pi-user',
      routerLink: ['donors'],
    },
    {
      label: 'lottery',
      icon: 'pi pi-gift',
      routerLink: ['lottery'] 
    },
  ]
  constructor(private router: Router,private cdr: ChangeDetectorRef) { }
if()
{

}
  ngOnInit() {
    
    if (localStorage.getItem("CUser")) {
     this.navSrv.updateLogoutS(true)
      const user = JSON.parse(localStorage.getItem("CUser") || "")
      if (user.name == "admin") {
        this.navSrv.updateAdmin(true)
      }
      else {
        this.navSrv.updateAdmin(false)
        const userGifts=JSON.parse(localStorage.getItem(`${user.name}Gifts`) || "")
        this.navSrv.updateCartBadge(userGifts.length.toString())
      }
    }
  }

  logout() {
    this.router.navigate(['/home'])
    localStorage.removeItem("CUser")
   this.navSrv.updateLogoutS(false)
   this.navSrv.updateAdmin(false)
   setTimeout(() => {
   window.location.reload()})
  }

  navigate(path: string){
    this.router.navigate([path])
  }

}

