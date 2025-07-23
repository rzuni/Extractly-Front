import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../../services/layout.service';
import { AuthService } from '../../../../services/auth.service';
import { MyAccountComponent } from "../../../my-account/my-account.component";
import { Router, RouterLink } from '@angular/router';
import { IUser } from '../../../../interfaces';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MyAccountComponent,
],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public user?: IUser;

  constructor(
    public router: Router,
    public layoutService: LayoutService,
    public authService: AuthService,
  ){}

    ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
