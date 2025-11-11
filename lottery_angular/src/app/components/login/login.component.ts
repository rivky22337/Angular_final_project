import { ChangeDetectorRef, Component, inject } from '@angular/core';
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
import { NavService } from '../../services/nav-srv.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [PasswordModule, InputTextModule, FormsModule, FocusTrapModule, ButtonModule, FormsModule, InputTextModule, CheckboxModule, IconFieldModule, InputIconModule, AutoFocusModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  userName?: string;
  password?: string;
  users?: User[]
  usersService: UsersService = inject(UsersService)
  navSrv: NavService = inject(NavService)

  constructor(private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.usersService.getUsers().subscribe((data) => {
      this.users = data
    })
  }

  onSubmit(frm: any) {
    if (frm.invalid) {
      Object.keys(frm.controls).forEach(field => {
        const control = frm.controls[field];
        control.markAsTouched({ onlySelf: true })
      });
    }
    else {
      if (this.users) {
        const user = this.users.find(u => u.name === this.userName)
        if (user) {
          if (user.password == this.password) {
            localStorage.setItem("CUser", JSON.stringify(user))
            if (user.name == "admin") {
              this.navSrv.updateAdmin(true)
            }
            else {
              if (!localStorage.getItem(`${user.name}Gifts`))
                localStorage.setItem(`${user.name}Gifts`, JSON.stringify([]))
              this.navSrv.updateCartBadge(JSON.parse(localStorage.getItem(`${user.name}Gifts`) || "").length)
              this.navSrv.updateAdmin(false)
            }
            this.router.navigate(['/home'])
            setTimeout(() => {
              window.location.reload()
            }, 100);
            this.navSrv.updateLogoutS(true)
          }
          else {
            frm.controls['password'].setErrors({ wrong: true });
          }
        }
        else {
          frm.controls['username'].setErrors({ exists: true });
        }
      }
    }
  }
}


