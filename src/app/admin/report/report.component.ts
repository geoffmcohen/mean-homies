import { Component, OnInit, Input } from '@angular/core';
import { PageStatsService } from '../../shared/page-stats.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  @Input() args: any;
  public data: any[];
  public columnsToDisplay: string[];

  constructor(private pageStatsService: PageStatsService) { }

  ngOnInit() {
    if(this.args.reportType == 'page request stats'){
      this.pageStatsService.getPageCounts().subscribe((res : any) => {
        this.columnsToDisplay = [ "pageName", "count"]; 
        this.data = res.results;
      });
    }
  }

}
