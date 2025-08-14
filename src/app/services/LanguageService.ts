import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {

    private apiUrl = 'http://localhost:8080/greeting';

    constructor(private http: HttpClient) { }

    setLanguage(language: string): Observable<any> {
        const headers = new HttpHeaders({
            'Accept-Language': language
        });

        return this.http.get(this.apiUrl, { headers: headers });
    }
}