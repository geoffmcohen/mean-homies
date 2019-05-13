import { Component, OnInit } from '@angular/core';
import { PageStatsService } from '../shared/page-stats.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private pageStatsService: PageStatsService) { }

  ngOnInit() {
    // Increment page stats for home page
    this.pageStatsService.incrementPageCount( "home" );
  }
}
