import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IContentEntryYt } from '../interfaces';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })

export class ContentEntryYtService {
  private items: IContentEntryYt[] = [];

  constructor(private http: HttpClient) {}

  add(entry: IContentEntryYt): void {
    this.items.push(entry);
  }

  update(updatedEntry: IContentEntryYt): void {
    const index = this.items.findIndex(item => item.source === updatedEntry.source);
    if (index > -1) {
      this.items[index] = updatedEntry;
    }
  }

  delete(entry: IContentEntryYt): void {
    const index = this.items.findIndex(item => item.source === entry.source);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }

  getAll(): IContentEntryYt[] {
    return [...this.items];
  }

  clear(): void {
    this.items = [];
  }

  process(entry: IContentEntryYt): Observable<Blob> {
    const url = `${environment.apiUrlyt}`;
    return this.http.post(url, entry, { responseType: 'blob' });
  }

 uploadYoutubeUrl(source: string): Observable<Blob> {
  const params = new URLSearchParams();
  params.set('youtubeUrl', source);

  const url = `${environment.apiUrlyt}=${encodeURIComponent(source)}`;
  return this.http.get(url, { responseType: 'blob' });
  }
}
 