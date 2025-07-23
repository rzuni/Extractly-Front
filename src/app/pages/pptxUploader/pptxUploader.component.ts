import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pptx-uploader', // Nuevo selector para tu componente
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './pptxUploader.component.html', 
  styleUrls: ['./pptxUploader.component.scss'] 
})
export class PptxUploaderComponent { // Nuevo nombre de clase para tu componente
  selectedFile: File | null = null;
  customPrompt: string = '';
  message: string = '';
  isError: boolean = false;
  isLoading: boolean = false;
  downloadUrl: string | null = null;

  public http: HttpClient = inject(HttpClient);

  constructor() { }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/pdf') { // Sigue aceptando solo PDF como entrada
      this.selectedFile = file;
      this.message = '';
      this.isError = false;
      this.downloadUrl = null;
    } else {
      this.selectedFile = null;
      this.message = 'Por favor, selecciona un archivo PDF válido.';
      this.isError = true;
      this.downloadUrl = null;
    }
  }

  uploadPdfAndGeneratePptx(): void { // Nombre del método actualizado
    if (!this.selectedFile) {
      this.message = 'Por favor, selecciona un archivo PDF primero.';
      this.isError = true;
      return;
    }

    this.isLoading = true;
    this.message = 'Subiendo y procesando PDF para generar PPTX...';
    this.isError = false;
    this.downloadUrl = null;

    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);

    if (this.customPrompt.trim()) {
      formData.append('customPrompt', this.customPrompt.trim());
    }

    // ¡IMPORTANTE! Ajusta esta URL a tu endpoint REAL de Spring Boot para generar PPTX desde un PDF
    const uploadUrl = 'http://localhost:8080/api/google-cloud/gemini/pptx-summary/pdf-to-pptx'; 

    this.http.post(uploadUrl, formData, {
      responseType: 'blob', // Esperamos una respuesta binaria (Blob)
      observe: 'response'
    }).subscribe(
      (response: any) => {
        this.isLoading = false;
        if (response.status === 200) {
          // CAMBIO CLAVE: Cambiar el tipo MIME del Blob para PPTX
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
        let errorMessage = 'Error desconocido al procesar el PDF.';
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
        console.error('Error al subir PDF:', error);
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