import { Component, OnInit } from '@angular/core';
import { BlogService } from './blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
  providers: [ BlogService ]
})
export class BlogComponent implements OnInit {
  private data: any;

  constructor(private blogService: BlogService) {
    console.log('constructor called on BlogComponent');
    this.data = {data: 'not called yet'};
}

  ngOnInit() {
    console.log('ngOnInit called on BlogComponent');
    this.blogService.test().subscribe((res : {}) => {
      this.data = res;
      console.log(this.data);
    });
  }

}
