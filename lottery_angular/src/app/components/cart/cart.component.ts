
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { GiftQ } from '../../models/GiftQ.model';
import { InputNumber } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GiftsService } from '../../services/gifts.service';
import { Gift } from '../../models/gift.model';
import { NavService } from '../../services/nav-srv.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [TableModule, TagModule, RatingModule, ButtonModule, CommonModule, InputNumber, FormsModule],
  providers: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})

export class CartComponent {
  giftsFromServer: Gift[] = [];
  giftsInStock!: GiftQ[]
  gifts!: GiftQ[];
  totalSum: number = 0;
  user: any;
  GiftSrv: GiftsService = inject(GiftsService)
  navSrv:NavService=inject(NavService)
  constructor(private router: Router) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("CUser") || "")
    this.gifts = JSON.parse(localStorage.getItem(`${this.user.name}Gifts`) || "") || []

    //this.giftsFromServer$ = this.GiftSrv.getGifts();
    this.GiftSrv.getGifts().subscribe((data) => {
      this.giftsFromServer = data;
      this.giftsInStock! = this.gifts.filter(gift => data.find(g => g.giftId == gift.gift.giftId))
      this.totalSum = this.giftsInStock.reduce(
        (sum: number, g: GiftQ) => sum + ((g.quantity || 0) * (g.gift.price || 0)),
        0
      );
      localStorage.setItem(`${this.user.name}Gifts`,JSON.stringify(this.giftsInStock))
    });
  }
  ngOnDestroy() {
    localStorage.setItem(`${this.user.name}Gifts`, JSON.stringify(this.gifts))
  }
  plus(gift: GiftQ) {
    if (gift.gift.price) this.totalSum += gift.gift.price
    localStorage.setItem(`${this.user.name}Gifts`, JSON.stringify(this.gifts))
  }
  minus(gift: GiftQ) {
    if (gift.gift.price) this.totalSum -= gift.gift.price
    if (gift.quantity == 0) {
      this.gifts = this.gifts.filter(g => g.gift.name != gift.gift.name)
      this.navSrv.updateCartBadge(this.gifts.length)
      window.location.reload()
      localStorage.setItem(`${this.user.name}Gifts`, JSON.stringify(this.gifts))
    }
    else {
      localStorage.setItem(`${this.user.name}Gifts`, JSON.stringify(this.gifts))

    }

  }
  payment(path: string) {
    this.router.navigate([path])
  }
}





