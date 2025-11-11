import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ChooseGiftsComponent } from './components/choose-gifts/choose-gifts.component';
import { GiftsListComponent } from './components/gifts-list/gifts-list.component';
import { DonorsComponent } from './components/donors/donors.component';
import { CartComponent } from './components/cart/cart.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PaymentComponent } from './components/payment/payment.component';
import { LotteryComponent } from './components/lottery/lottery.component';
import { LoginPageComponent } from './components/login-page/login-page.component';

let user:any
if(localStorage.getItem("CUser")){
     user = JSON.parse(localStorage.getItem("CUser") || "")
}

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'chooseGifts', component: ChooseGiftsComponent },
    { path: 'gifts', component: GiftsListComponent ,
        canActivate: [() => {
            if(user){
                return user.name=='admin'
            }
            return false
        }]
    },
    {
        path: 'donors', component: DonorsComponent,
        canActivate: [() => {
            if(user){
                return user.name=='admin'
            }
            return false
        }]
    },
    { path: 'cart', component: CartComponent },
    { path: 'login', component: LoginPageComponent , canActivate:[()=>!user]},
    { path: 'register', component: RegisterComponent , canActivate:[()=>!user]},
    { path: 'payment', component: PaymentComponent },
    { path: 'lottery', component: LotteryComponent,
        canActivate: [() => {
            if(user){
                return user.name=='admin'
            }
            return false
        }]
     },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
