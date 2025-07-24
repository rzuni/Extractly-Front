import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../services/layout.service';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { FooterComponent } from './elements/footer/footer.component';
import { NavbarComponent } from './elements/navbar/navbar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss'],
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    SvgIconComponent,
    FooterComponent
  ],
})
export class AppLayoutComponent {
  public title?: string;

  constructor(public layoutService: LayoutService) {
    // this.layoutService.title.subscribe((title) => (this.title = title));
  }
}