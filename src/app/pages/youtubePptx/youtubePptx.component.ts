import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-youtube-pptx-generator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './youtubePptx.component.html',
  styleUrls: ['./youtubePptx.component.scss']
})
export class YoutubePptxGeneratorComponent {
  youtubeUrl: string = '';
  languageCode: string = 'es-ES'; // Valor por defecto, puedes ajustarlo
  message: string = '';
  isError: boolean = false;
  isLoading: boolean = false;
  downloadUrl: string | null = null;
  downloadFileName: string | null = null;

  public http: HttpClient = inject(HttpClient);

  constructor() { }

  generatePptxFromYoutubeUrl(): void {
    if (!this.youtubeUrl) {
      this.message = 'Por favor, introduce una URL de YouTube.';
      this.isError = true;
      return;
    }

    this.isLoading = true;
    this.message = 'Procesando video de YouTube para generar PPTX...';
    this.isError = false;
    this.downloadUrl = null;
    this.downloadFileName = null;

    // Configurar los parámetros de la solicitud GET
    let params = new HttpParams()
      .set('youtubeUrl', this.youtubeUrl)
      .set('languageCode', this.languageCode);

    // ¡IMPORTANTE! Ajusta esta URL a tu endpoint REAL de Spring Boot
    const apiUrl = `${environment.apiUrlytPptx}`;

    this.http.get(apiUrl, {
      params: params,
      responseType: 'blob', // Esperamos una respuesta binaria (Blob)
      observe: 'response'
    }).subscribe(
      (response: any) => {
        this.isLoading = false;
        if (response.status === 200) {
          // Obtener el nombre de archivo del header Content-Disposition
          const contentDisposition = response.headers.get('Content-Disposition');
          const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
          this.downloadFileName = filenameMatch ? filenameMatch[1] : 'resumen.pptx';

          // Crear el Blob y la URL de descarga
          const blob = new Blob([response.body], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
          this.downloadUrl = window.URL.createObjectURL(blob);

          this.message = '¡Presentación PPTX de resumen generada exitosamente!';
          this.isError = false;
        } else {
          this.handleErrorResponse(response);
        }
      },
      (error) => {
        this.isLoading = false;
        this.isError = true;
        let errorMessage = 'Error desconocido al procesar el video.';
        if (error.error instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
            errorMessage = `Error del servidor: ${reader.result}`;
            this.message = errorMessage;
          };
          reader.onerror = () => {
            this.message = 'Error del servidor: No se pudo leer el mensaje de error.';
          };
          reader.readAsText(error.error);
        } else if (error.message) {
          errorMessage = `Error de red o conexión: ${error.message}`;
          this.message = errorMessage;
        } else {
          this.message = errorMessage;
        }

      }
    );
  }

  private handleErrorResponse(response: any): void {
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