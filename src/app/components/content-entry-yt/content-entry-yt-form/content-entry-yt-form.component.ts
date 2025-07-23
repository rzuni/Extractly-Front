import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IContentEntryYt } from '../../../interfaces';
import { ContentEntryYtService } from '../../../services/ContentEntryYtService';

@Component({
  selector: 'app-content-entry-yt-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './content-entry-yt-form.component.html',
  styleUrls: ['./content-entry-yt-form.component.scss']
})
export class ContentEntryYtFormComponent {
  @Input() formData: IContentEntryYt = {};
  @Output() onSubmit = new EventEmitter<IContentEntryYt>();

  public selectedLanguage: 'es' | 'en' | undefined = undefined;
  public isLoading = false;
  public message = '';
  public isError = false;
  public downloadUrl: string | null = null;

  private ytService = inject(ContentEntryYtService);

  ngOnInit(): void {
    this.selectedLanguage = this.formData.language || undefined;
  }

  setLanguage(lang: 'es' | 'en') {
    this.selectedLanguage = lang;
  }

  submitForm(): void {
    this.clearMessages();

    if (this.formData.source?.includes('youtube.com') || this.formData.source?.includes('youtu.be')) {
      this.uploadYoutubeLink();
    } else if (this.formData.type === 'archivo' && this.formData.fileUrl) {
      // Aquí puedes implementar carga de archivo si deseas, o simplemente guardar localmente
      this.finalizeSubmission();
    } else {
      this.message = 'Por favor, ingresa un enlace de YouTube válido o selecciona un archivo.';
      this.isError = true;
    }
  }

  uploadYoutubeLink(): void {
    if (!this.formData.source || !this.selectedLanguage) {
      this.message = 'Por favor, ingresa un enlace válido y selecciona un idioma.';
      this.isError = true;
      return;
    }

    this.isLoading = true;
    this.message = 'Procesando video de YouTube...';
    this.isError = false;
    this.downloadUrl = null;

    const formData = new FormData();
    formData.append('source', this.formData.source);
    formData.append('language', this.selectedLanguage);

    this.ytService.uploadYoutubeUrl(formData).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        this.downloadUrl = url;

        const a = document.createElement('a');
        a.href = url;
        a.download = 'resumen_youtube.pdf';
        a.click();
        window.URL.revokeObjectURL(url);

        this.isLoading = false;
        this.message = '¡Resumen generado exitosamente!';
        this.isError = false;

        this.finalizeSubmission();
      },
      error: (err) => {
        this.isLoading = false;
        this.isError = true;
        this.message = 'Error al procesar el video de YouTube.';
        console.error(err);
      }
    });
  }

  finalizeSubmission(): void {
    const finalData: IContentEntryYt = {
      ...this.formData,
      language: this.selectedLanguage
    };
    this.onSubmit.emit(finalData);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.formData.fileUrl = URL.createObjectURL(file);
      this.formData.source = file.name;
      this.formData.type = 'archivo';
    }
  }

  clearFields(): void {
    this.formData = {};
    this.selectedLanguage = undefined;
    this.clearMessages();
  }

  clearMessages(): void {
    this.message = '';
    this.isError = false;
    this.isLoading = false;
    this.downloadUrl = null;
  }

  get isFileValid(): boolean {
    return !!this.formData.fileUrl || !!this.formData.source;
  }
}
