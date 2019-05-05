import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-blog-page-navigation',
  templateUrl: './blog-page-navigation.component.html',
  styleUrls: ['./blog-page-navigation.component.css']
})
export class BlogPageNavigationComponent implements OnInit {
  @Input() pageInfo: any;

  constructor() { }

  ngOnInit() {
  }

  // Function to create an array of page numbers to use for the navigation link
  public createPageNumbers(): number[]{
    var pageNumbers: number[] = new Array();
    if(this.pageInfo.pageCount){
      for(var i = 1; i <= this.pageInfo.pageCount; i++ ){
        pageNumbers.push(i);
      }
    }
    return pageNumbers;
  }
}
