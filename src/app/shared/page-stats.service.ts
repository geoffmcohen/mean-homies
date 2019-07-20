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

  // Gets page counts
  public getPageCounts(): Observable<any>{
    // Make the REST call to the api
    return this.http.get<any>('/api/admin/get_page_counts');
  };

  // Increments the page count for page/component
  public recordPageStats(pageName: string, username: string, isMobile: boolean): void{
    this.http.post<any>("/api/record_page_stats", {pageName: pageName, username: username, isMobile: String(isMobile)}).subscribe((res: any) => {});
  }
}
