import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../auth/authentication.service'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  public loggedIn: boolean;
  public loggedInUser: string;
  public componentDisplayed: any;

  constructor( private authService: AuthenticationService ) { }

  ngOnInit() {
    // Check if a user is logged in
    this.loggedIn = this.authService.checkAdminIsLoggedIn();
    if(this.loggedIn){
      this.loggedInUser = this.authService.getAdminUser();
    }
    // Default the displayed component so we don't get a page error
    this.componentDisplayed = {componentName: ''};
  }

  // Updates the login information based the change in state from the child component
  updateLogin($event){
    this.loggedIn = $event;
    if(this.loggedIn){
      this.loggedInUser = this.authService.getAdminUser();
    } else {
      this.loggedInUser = null;
    }
  }

  // Switch main component based on menu selections
  switchComponent($event){
    this.componentDisplayed = $event;
  }

}
