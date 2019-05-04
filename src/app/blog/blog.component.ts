import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from './blog.service';
import { BlogPostComponent } from './blog-post/blog-post.component';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
  providers: [ BlogService ]
})
export class BlogComponent implements OnInit {
  public pageInfo: any;
  public blogPosts: any[];

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get the page number from the route if provided
    this.route.params.subscribe(params => {
      var pageNumber = 1;
      if (params['pageNumber']) pageNumber = +params['pageNumber'];
      console.log("Page number = %d", pageNumber);

      this.blogService.getPosts(pageNumber).subscribe((res : any) => {
        this.blogPosts = res.blogPosts;
        this.pageInfo = res.pageInfo;
      });
    });

  }
}
