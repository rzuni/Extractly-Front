import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'ContentEntryYtFormComponent',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './content-entry-yt.component.html',
  styleUrls: ['./content-entry-yt.component.scss']
})
export class ContentEntryYtComponent {
  public http: HttpClient = inject(HttpClient);

  selectedFile: File | null = null;
  youtubeUrl: string = '';
  message: string = '';
  isError: boolean = false;
  isLoading: boolean = false;
  downloadUrl: string | null = null;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type === 'video/mp4') {
      this.selectedFile = file;
      this.message = '';
      this.isError = false;
      this.downloadUrl = null;
    } else {
      this.selectedFile = null;
      this.message = 'Por favor, selecciona un archivo de video mp4 válido.';
      this.isError = true;
      this.downloadUrl = null;
    }
  }

  clearFields() {
    this.selectedFile = null;
    this.youtubeUrl = '';
    this.message = '';
    this.isError = false;
    this.downloadUrl = null;
  }

  submit() {
    if (!this.selectedFile && !this.youtubeUrl.trim()) {
      this.message = 'Por favor, selecciona un archivo mp4 o ingresa un enlace de YouTube.';
      this.isError = true;
      return;
    }

    this.isLoading = true;
    this.message = 'Procesando solicitud...';
    this.isError = false;
    this.downloadUrl = null;

    if (this.youtubeUrl.trim()) {
      this.callApiWithUrl(this.youtubeUrl.trim());
    } else {
      this.isLoading = false;
      this.message = 'Solo se permite generar resumen desde enlace de YouTube por ahora.';
      this.isError = true;
    }
  }

  callApiWithUrl(youtubeUrl: string) {
    const params = {
      youtubeUrl: youtubeUrl,
      languageCode: 'es-ES'
    };

    const query = new URLSearchParams(params as any).toString();

    const url = `${environment.apiUrlyt}?${query}`;

    this.http.get(url, { responseType: 'blob', observe: 'response' }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === 200) {
          const blob = new Blob([response.body!], { type: 'application/pdf' });
          this.downloadUrl = window.URL.createObjectURL(blob);
          this.message = '¡Resumen PDF generado exitosamente!';
          this.isError = false;
        } else {
          this.handleErrorResponse(response);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.isError = true;
        let errMsg = 'Error desconocido al generar el resumen.';
        if (error.error instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            this.message = `Error del servidor: ${reader.result}`;
          };
          reader.onerror = () => {
            this.message = 'Error del servidor: No se pudo leer el mensaje de error.';
          };
          reader.readAsText(error.error);
        } else if (error.message) {
          this.message = `Error de red o conexión: ${error.message}`;
        } else {
          this.message = errMsg;
        }
      }
    });
  }

  private handleErrorResponse(response: any) {
    this.isError = true;
    if (response && response.body instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => {
        this.message = `Error del servidor (${response.status}): ${reader.result}`;
      };
      reader.onerror = () => {
        this.message = `Error del servidor (${response.status}): No se pudo leer el mensaje de error.`;
      };
      reader.readAsText(response.body);
    } else {
      this.message = `Error del servidor (${response.status}).`;
    }
  }
}
