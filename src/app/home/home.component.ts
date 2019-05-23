import { Component, OnInit } from '@angular/core';
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
    private authService: AuthenticationService,
    private pageStatsService: PageStatsService
  ) { }

  ngOnInit() {
    // Increment page stats for home page
    this.pageStatsService.incrementPageCount( "home" );

    // Check if a user is logged in
    this.loggedIn = this.authService.checkUserIsLoggedIn();
    if(this.loggedIn){
      this.loggedInUser = this.authService.getUser();
    }
  }

  // Updates the login information based the change in state from the child component
  updateLogin($event){
    this.loggedIn = $event;
    if(this.loggedIn){
      this.loggedInUser = this.authService.getUser();
    } else {
      this.loggedInUser = null;
    }
  }

  // Opens up the blog in a new window
  openBlog(){
    window.open('/blog', '_blank');
  }
}
