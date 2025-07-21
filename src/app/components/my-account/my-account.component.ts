import { Component, OnInit, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { CommonModule } from '@angular/common';

@Component({
  selector: "app-my-account",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: "./my-account.component.html",
})
export class MyAccountComponent implements OnInit {
  public userName: string = '';
  public menuOpen: boolean = true;
  private service = inject(AuthService);

  constructor(public router: Router) {
    let user = localStorage.getItem('auth_user');
    if(user) {
      this.userName = JSON.parse(user)?.name;
    } 
  }

  ngOnInit() {}

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.service.logout();
    this.router.navigateByUrl('/login');
  }
}
