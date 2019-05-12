import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient) { }

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

  // Calls the REST service to create the blog post
  public createBlogPost(
    adminToken: string,
    adminUser: string,
    blogPostTitle: string,
    blogPostBody: string,
    // Need to add the file somehow
    callback: ((result: any) => void)
  ): void{
    this.http.post<any>('/api/admin/create_blog_post', {
      adminToken: adminToken,
      adminUser: adminUser,
      title: blogPostTitle,
      body: blogPostBody,
    }).subscribe((res : any) => {
      callback(res);
    });
  }

}
