import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

  // public test(){
  //   console.log('Test called on BlogService');
  //   return this.http.get<any>('/api/test');
  // }

  public getPosts(
    page: number = 1,
    postsPerPage: number = 3
  ): Observable<any>{
    // Set up the parameters to pass
    var params = new HttpParams()
      .set('page', String(page))
      .set('posts_per_page', String(postsPerPage));

    // Make the REST call
    return this.http.get<any>('/api/blog/get_posts', {params});
  }
}
