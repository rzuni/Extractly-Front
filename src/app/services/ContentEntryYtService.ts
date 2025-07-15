import { Injectable } from '@angular/core';
import { IContentEntryYt } from '../interfaces/index';

@Injectable({ providedIn: 'root' })
export class ContentEntryYtService {
  private items: IContentEntryYt[] = [];

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
}
