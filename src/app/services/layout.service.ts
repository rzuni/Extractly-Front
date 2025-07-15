import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Subject,
  debounceTime,
  fromEvent,
  takeUntil,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private unsubscriber: Subject<any> = new Subject();
  private pageTitle = new BehaviorSubject<string>('');

  public title = this.pageTitle.asObservable();
  public navbarOpen: boolean = true;

  constructor() {
    fromEvent(window, 'resize')
      .pipe(debounceTime(100), takeUntil(this.unsubscriber))
      .subscribe((event: any) => {
        this.navbarOpen = event.target.innerWidth >= 991;
      });
  }

  public setTitle(title: string) {
    this.pageTitle.next(title);
  }

  ngOnDestroy(): void {
    this.unsubscriber.complete();
  }

  public toggleNavbar(): void {
    this.navbarOpen = !this.navbarOpen;
  }
}