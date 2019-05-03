import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//import { BlogResponse } from './blog-response';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

  public test(){
    console.log('Test called on BlogService');
    return this.http.get<any>('/api/test');
  }
  public getPosts(): Observable<any>{
    // #TODO: Need to figure out how to pass params
    console.log("getPosts called on BlogService");
    return this.http.get<any>('/api/blog/get_posts');
  }
}
