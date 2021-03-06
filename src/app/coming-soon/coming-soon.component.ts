import { Component, OnInit } from '@angular/core';
import { PageStatsService } from '../shared/page-stats.service';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.css']
})
export class ComingSoonComponent implements OnInit {
  // public launchDate: Date = new Date("9/18/2019");

  constructor(private pageStatsService: PageStatsService) { }

  ngOnInit() {
    // Increment page stats for home page
    this.pageStatsService.incrementPageCount( "coming_soon" );
  }

}
