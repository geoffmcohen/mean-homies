import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../auth/authentication.service';
import { PageStatsService } from '../shared/page-stats.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public loggedIn: boolean;
  public loggedInUser: string;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private pageStatsService: PageStatsService
  ) { }

  ngOnInit() {
    // Increment page stats for home page
    this.pageStatsService.incrementPageCount( "home" );

    // Get initial login state and track changes
    this.subscribeToLoginChanges();
  }

  // Set up login state and subscribe to changes
  subscribeToLoginChanges(){
    // Get the initial state of the login
    this.loggedIn = this.authService.checkUserIsLoggedIn();
    if(this.loggedIn){
      this.loggedInUser = this.authService.getUser();
    }

    // Subscribe to login changes
    this.authService.userLoginChange.subscribe(loggedIn => {
      this.loggedIn = loggedIn;
      if(this.loggedIn){
        this.loggedInUser = this.authService.getUser();
      } else {
        this.loggedInUser = null;
      }
    });
  }

  // Opens up the blog in a new window
  openBlog(){
    window.open('/blog', '_blank');
  }
}
