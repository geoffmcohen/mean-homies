import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../auth/authentication.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {
  public loggedIn: boolean;

  constructor(
    private authService: AuthenticationService,
  ) { }

  ngOnInit() {
    // Check if a user is logged in
    this.subscribeToLoginChanges();
  }

  // Set up login state and subscribe to changes
  subscribeToLoginChanges(){
    // Get the initial state of the login
    this.loggedIn = this.authService.checkUserIsLoggedIn();

    // Subscribe to login changes
    this.authService.userLoginChange.subscribe(loggedIn => {
      this.loggedIn = loggedIn;
    });
  }
}
