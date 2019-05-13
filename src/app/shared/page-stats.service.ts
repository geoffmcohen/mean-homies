import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageStatsService {

  constructor(private http: HttpClient) { }

  // Increments the page count for page/component
  public incrementPageCount( pageName: string ): void{
    this.http.post<any>("/api/increment_page_count", { pageName: pageName }).subscribe((res: any) => {});
  }
}
