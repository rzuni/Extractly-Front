import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilesaveService {
  private endpoint = '/api/history';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.endpoint);
  }

  create(message: string): Observable<any> {
    return this.http.post(this.endpoint, message, { responseType: 'text' });
  }
}
