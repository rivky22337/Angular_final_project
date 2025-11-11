
import { Component, inject } from '@angular/core';
import { FocusTrapModule } from 'primeng/focustrap';
import { ButtonModule } from 'primeng/button';
import { FormsModule} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AutoFocusModule } from 'primeng/autofocus';
import { GiftQ } from '../../models/GiftQ.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GiftsService } from '../../services/gifts.service';
import { Gift } from '../../models/gift.model';



@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  standalone: true,
  imports: [InputTextModule,FormsModule, FocusTrapModule, ButtonModule, FormsModule, InputTextModule, CheckboxModule, IconFieldModule, InputIconModule, AutoFocusModule, CommonModule],
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  userGifts!: GiftQ[];
  user: any;
  gifts: Gift[] = [];

  submitted: boolean = true
  creditCardNumber?: string
  expirationDate?: string
  digits?: string
  accept?: boolean
  visible: boolean = true
  giftsService: GiftsService = inject(GiftsService);


  constructor(private router: Router) { }


  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("CUser") || "")
    this.userGifts = JSON.parse(localStorage.getItem(`${this.user.name}Gifts`) || "") || []
    this.giftsService.getGifts().subscribe((data: Gift[]) => (this.gifts = data));
  }
  
  onSubmit(form: any){
    if (form.invalid) {
      Object.keys(form.controls).forEach(field => {
        const control = form.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
    }
    else {
      this.visible = false
      this.userGifts.map(g => {
        let foundedGift = this.gifts.find(gift => g.gift.name === gift.name)
        if (foundedGift) {
          if (!foundedGift.users) {
            foundedGift.users = []
          }
        }
        for (let i = 0; i < g.quantity; i++)
          foundedGift?.users?.push(this.user.name)
        if(g.gift.giftId&&foundedGift)
         this.giftsService.update(g.gift.giftId,foundedGift).subscribe(
          () => {     }
      );
      })
      
      localStorage.setItem(`${this.user.name}Gifts`,JSON.stringify([]))
    }
  }
  toHome(path: string) {
    this.router.navigate([path])
  }
  onlyNumbers(event: any): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');  // מחליף כל דבר שאינו מספר
  }
}
