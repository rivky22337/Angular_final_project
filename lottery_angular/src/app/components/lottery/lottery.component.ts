import { Component, inject } from '@angular/core';
import { GiftsService } from '../../services/gifts.service';
import { Gift } from '../../models/gift.model';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { GiftQ } from '../../models/GiftQ.model';
import { InputNumber } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { MailService } from '../../services/mail-service.service';
import { User } from '../../models/User.model';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-lottery',
  standalone: true,
  imports: [ButtonModule,TableModule, TagModule, RatingModule, CommonModule, FormsModule],
  templateUrl: './lottery.component.html',
  styleUrl: './lottery.component.css'
})
export class LotteryComponent {
  gifts: Gift[] = [];
  users:User[]=[]
  button:boolean=true;
  spinner:boolean=false;
  winners:boolean=false
  giftsService: GiftsService = inject(GiftsService);
  mailService:MailService=inject(MailService)
  userSrv:UsersService=inject(UsersService)
ngOnInit(){
  this.giftsService.getGifts().subscribe((data: Gift[]) => (this.gifts = data));
  this.userSrv.getUsers().subscribe((data: User[]) => (this.users = data));
}
lottery(){
  this.spinner=true
  this.button=false
  setTimeout(() => {
    this.spinner=false
    this.winners=true
    this.gifts.map(g=>{
      if(g.users){
        const randomIndex = Math.floor(Math.random() * g.users.length)
        g.winner=g.users[randomIndex]
      }
      else{
        g.winner="noWinner"
      }
    })
    this.sendEmails()
  }, 3000);
}
sendEmails() {
  this.gifts.forEach(gift => {
    const email=this.users.find(u=>u.name==gift.winner)?.email    
    const emailDetails = {
      to:email||"cz6778685@gmail.com",
      subject: 'You Won!!!!',
      body: `<div>Hello!</div><h1>You won the gift ${gift.name}!!!!!</h1><div>Congratulations❤️❤️❤️</div>`
    };
    this.mailService.sendEmail(emailDetails).subscribe(response => {
      console.log('Email sent successfully!', response);
    }, error => {
      console.error('Error sending email', error);
    });
  });
}}
