import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../services/LanguageService';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent {
  constructor(private languageService: LanguageService) {}

  onLanguageChange(selectedLanguage: string): void {
    console.log(`Idioma seleccionado: ${selectedLanguage}`);
    this.languageService.setLanguage(selectedLanguage).subscribe({
      next: (response: any) => {
        console.log('Respuesta del back-end:', response);
        window.location.reload();
      },
      error: (err: any) => {
        console.error('Error al enviar el idioma al back-end:', err);
      }
    });
  }
}
