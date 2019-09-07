import { Component, OnInit } from '@angular/core';
import { TermsService } from '../terms.service';

@Component({
  selector: 'app-terms-of-service',
  templateUrl: './terms-of-service.component.html',
  styleUrls: ['./terms-of-service.component.css']
})
export class TermsOfServiceComponent implements OnInit {
  public userTerms: string;
  public privacyPolicy: string;

  constructor(
    private termsService: TermsService,
  ) { }

  ngOnInit() {
    // Get the terms and privacy policies from the terms service
    this.userTerms = this.formatText(this.termsService.getUserTermsAndConditions());
    this.privacyPolicy = this.formatText(this.termsService.getPrivacyPolicy());
  }

  // Formats the text strings with appropriate html tags
  formatText(t: string): string{
    // Wraps the entire string in paragraph tab
    t = "<p>" + t + "</p>";

    // Replaces double spaces with new paragraph tags
    t = t.replace(/\n\n/g, "</p><p>");

    // Replaces single spaces with line break tags
    t = t.replace(/\n/g, "<br>");
    
    return t;
  }
}
