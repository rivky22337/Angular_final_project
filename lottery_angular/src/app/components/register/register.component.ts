import { Component, inject } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/User.model';
import { FocusTrapModule } from 'primeng/focustrap';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AutoFocusModule } from 'primeng/autofocus';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [PasswordModule,InputTextModule,FormsModule, FocusTrapModule, ButtonModule, FormsModule, InputTextModule, CheckboxModule, IconFieldModule, InputIconModule, AutoFocusModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
userSrv=inject(UsersService)
user:User={};
users:User[]=[]
duplicateUser?:User
constructor(private router:Router){}
onSubmit(frm:any){
  if (frm.invalid) {
    Object.keys(frm.controls).forEach(field => {
      const control = frm.controls[field];
      control.markAsTouched({ onlySelf: true })
    });
  }
  else{
    this.userSrv.getUsers().subscribe((data:User[]) => {
       this.duplicateUser= data.find(u=>u.name===this.user.name)
       if(this.duplicateUser){
        frm.controls['name'].setErrors({ duplicate: true });
      }
      else{      
      this.userSrv.add(this.user).subscribe(() => {     })
      this.router.navigate(['/login'])
      }
    })


  }

}
}