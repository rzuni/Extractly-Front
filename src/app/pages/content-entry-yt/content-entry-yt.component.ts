import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IContentEntryYt } from '../../interfaces/index';
import { ContentEntryYtService } from '../../services/ContentEntryYtService';
import { ContentEntryYtFormComponent } from '../../components/content-entry-yt/content-entry-yt-form/content-entry-yt-form.component';
import { ContentEntryYtListComponent } from '../../components/content-entry-yt/content-entry-yt-list/content-entry-yt-list.component';
import { NavbarComponent } from '../../components/app-layout/elements/navbar/navbar.component';
import { FooterComponent } from '../../components/app-layout/elements/footer/footer.component';
import { computeMsgId } from '@angular/compiler';
@Component({
  selector: 'app-content-entry-yt',
  standalone: true,
  imports: [
    CommonModule,
    ContentEntryYtFormComponent,
    ContentEntryYtListComponent,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './content-entry-yt.component.html',
  styleUrls: ['./content-entry-yt.component.scss']
})
export class ContentEntryYtPage {
  public itemList: IContentEntryYt[] = [];
  private entryService = new ContentEntryYtService();

  constructor() {
    this.itemList = this.entryService.getAll();
  }

  addEntry(entry: IContentEntryYt): void {
    this.entryService.add(entry);
    this.itemList = this.entryService.getAll();
  }
}
