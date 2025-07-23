import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IContentEntryYt } from '../interfaces/index';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContentEntryYtService {
  private items: IContentEntryYt[] = [];

  constructor(private http: HttpClient) {}

  getAll(): IContentEntryYt[] {
    return [...this.items];
  }

  add(entry: IContentEntryYt): void {
    entry.id = Date.now();
    this.items.push(entry);
  }

  update(entry: IContentEntryYt): void {
    const index = this.items.findIndex(e => e.id === entry.id);
    if (index !== -1) {
      this.items[index] = { ...entry };
    }
  }

  delete(entry: IContentEntryYt): void {
    this.items = this.items.filter(e => e.id !== entry.id);
  }

  /**
   * Método NUEVO que sigue la misma arquitectura de PdfUploaderComponent
   * Realiza un POST con FormData para subir un enlace de YouTube y recibir un PDF resumido.
   */
  uploadYoutubeUrl(formData: FormData): Observable<Blob> {
    const uploadUrl = 'http://localhost:8080/api/google-cloud/gemini/yt-to-summary-pdf';
    return this.http.post(uploadUrl, formData, {
      responseType: 'blob'
    });
  }

  /**
   * Método anterior (opcional), aún disponible si querés usar GET con query params
   */
  downloadYoutubePdf(youtubeUrl: string, language: string = 'es-ES'): Observable<Blob> {
    return this.http.get(`/api/youtube/resumen/pdf`, {
      params: { youtubeUrl, languageCode: language },
      responseType: 'blob'
    });
  }
}
