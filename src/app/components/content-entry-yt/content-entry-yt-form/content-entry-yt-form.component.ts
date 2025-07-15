import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IContentEntryYt } from '../../../interfaces/index';
import { NavbarComponent } from '../../app-layout/elements/navbar/navbar.component';
import { FooterComponent } from '../../app-layout/elements/footer/footer.component';

@Component({
  selector: 'app-content-entry-yt-form',
  templateUrl: './content-entry-yt-form.component.html',
  styleUrls: ['./content-entry-yt-form.component.scss'],
  standalone: true,
  imports: []
})
export class ContentEntryYtFormComponent {
  @Input() formData: IContentEntryYt = {};
  @Output() onSubmit = new EventEmitter<IContentEntryYt>();

  selectedLanguage: 'es' | 'en' | undefined = undefined;

  ngOnInit(): void {
    this.selectedLanguage = this.formData.language || undefined;
  }

  setLanguage(lang: 'es' | 'en') {
    this.selectedLanguage = lang;
  }

  submitForm() {
    const finalData: IContentEntryYt = {
  ...this.formData,
  language: this.selectedLanguage
};

    this.onSubmit.emit(finalData);
  }

  clearFields() {
    this.formData = {};
    this.selectedLanguage = undefined;
  }
}
