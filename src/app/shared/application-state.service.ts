import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApplicationStateService {
  private isMobile: boolean;

  constructor() {
    // Uses width to determine whether to use mobile versions
    this.isMobile = window.innerWidth < 768 ? true : false;
  }

  // Returns whether to use mobile components or regular
  public getIsMobile(): boolean {
    return this.isMobile;
  }
}
