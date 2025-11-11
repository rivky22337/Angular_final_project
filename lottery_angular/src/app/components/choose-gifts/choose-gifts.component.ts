import { ChangeDetectorRef, Component, EventEmitter, inject, Input, NgModule, Output } from '@angular/core';
import { Gift } from '../../models/gift.model';
import { DataView } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { GiftsService } from '../../services/gifts.service';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/User.model';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { GiftQ } from '../../models/GiftQ.model';
import { NavService } from '../../services/nav-srv.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-choose-gifts',
  standalone: true,
  imports: [
    DataView,
    ButtonModule,
    CommonModule,
    SelectButton,
    FormsModule,
    Dialog,
    InputTextModule,
    AvatarModule,
    FormsModule,
    ToastModule,
    LoginComponent
  ],
  providers: [GiftsService, UsersService,MessageService],
  templateUrl: './choose-gifts.component.html',
  styleUrl: './choose-gifts.component.css'
})
export class ChooseGiftsComponent {
  // layout: string = 'grid';
  layout: 'list' | 'grid' = 'grid'; // הגדרת ערך ברירת מחדל תקין

  email?: string
  password?: string
  submitted: boolean = false
  message: string = ""
  navSrv:NavService=inject(NavService)
  gifts = signal<any>([]);
  users?: User[]

  options = [
    { label: 'List', value: 'list' },
    { label: 'Grid', value: 'grid' }
  ];

  constructor(private giftsService: GiftsService, private usersService: UsersService,private messageService: MessageService
  ) { }


  ngOnInit() {
    this.giftsService.getGifts().subscribe((data) => {
      this.gifts.set([...data.slice(0, 12)]);
    });
     this.usersService.getUsers().subscribe((data) => {
      this.users = data
    })

  }
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  buyGift(gift: Gift) {
    if (localStorage.getItem("CUser")) {
      const user=JSON.parse(localStorage.getItem("CUser")||"")
      const gifts:GiftQ[] = JSON.parse(localStorage.getItem(`${user.name}Gifts`) || "") || []
      const isGift = gifts.find(g=>g.gift.name===gift.name)
      if(isGift){
        isGift.quantity=isGift.quantity+1
      }
      else{
        const giftQ:GiftQ = {gift:gift,quantity:1}
        gifts.push(giftQ)
      }
      localStorage.setItem(`${user.name}Gifts`, JSON.stringify(gifts))
      console.log(gifts.length);
      this.navSrv.updateCartBadge(gifts.length)
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'gift added successfully',
        life: 1000
    })
    }
    else {
      this.showDialog()
    }
  }
  login = async () => {
    this.submitted=true
    if (this.users) {
      const user = this.users.find(u => u.name === this.email)
      if (user) {
        if (user.password == this.password) {
          localStorage.setItem("CUser", JSON.stringify(user))
          if(!localStorage.getItem(`${user.name}Gifts`))
          localStorage.setItem(`${user.name}Gifts`, JSON.stringify([]))
          this.visible = false
          this.navSrv.updateLogoutS(true)
          window.location.reload()
        }
        else {
          this.message = "Password is not correct"
        }
      }
      else {
        this.message = "User name does not exists"
      }

    }
  }
}
