import { Component, OnInit } from '@angular/core';
import { BlogService } from './blog.service';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
  providers: [ BlogService ]
})
export class BlogComponent implements OnInit {
  public pageInfo: any;
  public blogPosts: any[];

  constructor(private blogService: BlogService) {}

  ngOnInit() {
    this.blogService.getPosts().subscribe((res : any) => {
      this.blogPosts = res.blogPosts;
      this.pageInfo = res.pageInfo;
    });
  }

}
