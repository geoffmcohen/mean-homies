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
    blogImage: File,
    callback: ((result: any) => void)
  ): void{
    // Create form data to hold parameters
    var formData = new FormData();
    formData.append( 'adminToken', adminToken );
    formData.append( 'adminUser', adminUser );
    formData.append( 'title', blogPostTitle );
    formData.append( 'body', blogPostBody );

    // If the image has been provided add it to the form data
    if (blogImage) {
      formData.append( 'imageFile', blogImage, blogImage.name );
    };

    //  Make the REST call to publish the blog post
    this.http.post<any>('/api/admin/create_blog_post', formData).subscribe((res : any) => {
      callback(res);
    });
  }

}
