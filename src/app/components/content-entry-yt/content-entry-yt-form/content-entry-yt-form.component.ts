import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IContentEntryYt } from '../../../interfaces/index';
import { ContentEntryYtService } from '../../../services/ContentEntryYtService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-content-entry-yt-form',
  templateUrl: './content-entry-yt-form.component.html',
  styleUrls: ['./content-entry-yt-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ContentEntryYtFormComponent {
  @Input() formData: IContentEntryYt = {};
  @Output() onSubmit = new EventEmitter<IContentEntryYt>();

  selectedLanguage: 'es' | 'en' | undefined = undefined;

  constructor(private ytService: ContentEntryYtService) {}

  ngOnInit(): void {
    this.selectedLanguage = this.formData.language || undefined;
  }

  setLanguage(lang: 'es' | 'en') {
    this.selectedLanguage = lang;
  }

  submitForm() {
    if (this.formData.source?.includes('youtube.com') || this.formData.source?.includes('youtu.be')) {
      this.formData.type = 'enlace';

      this.ytService.downloadYoutubePdf(this.formData.source, this.selectedLanguage || 'es-ES')
        .subscribe(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'resumen_youtube.pdf';
          a.click();
          window.URL.revokeObjectURL(url);

          const finalData: IContentEntryYt = {
            ...this.formData,
            language: this.selectedLanguage
          };
          this.onSubmit.emit(finalData);
        });

      return;
    }

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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.formData.fileUrl = URL.createObjectURL(file);
      this.formData.type = 'archivo';
      this.formData.source = file.name;
    }
  }

  get isFileValid(): boolean {
    return !!this.formData.fileUrl || !!this.formData.source;
  }
}
