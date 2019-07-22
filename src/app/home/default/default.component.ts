import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material";
import { AuthenticationService } from '../../auth/authentication.service';
import { UserService } from '../../user/user.service';
import { HomiesService } from '../../homies/homies.service';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {
  public loggedIn: boolean;

  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private homiesService: HomiesService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    // Check if a user is logged in
    this.subscribeToLoginChanges();
  }

  // Set up login state and subscribe to changes
  subscribeToLoginChanges(){
    // Get the initial state of the login
    this.loggedIn = this.authService.checkUserIsLoggedIn();

    // If a user is logged in redirect them to an appropriate page
    if(this.loggedIn) this.redirectToRelevantPage();

    // Subscribe to login changes
    this.authService.userLoginChange.subscribe(loggedIn => {
      this.loggedIn = loggedIn;

      // If a user is logged in redirect them to an appropriate page
      if(this.loggedIn) this.redirectToRelevantPage();
    });
  }

  // Displays a loading dialog
  showLoadingDialog(){
    // Only show if loading dialog is undefined
    if(!this.loadingDialogRef){
      // Create the loading dialog
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;

      // Show the loading dialog
      this.loadingDialogRef = this.dialog.open(LoadingDialogComponent, dialogConfig);
    }
  }

  // Closes the loading dialog
  closeLoadingDialog(){
    // Only try to close if dialog ref defined
    if(this.loadingDialogRef){
      // Close the loading dialog
      this.loadingDialogRef.close();

      // Nullify the ref
      this.loadingDialogRef = null;
    }
  }

  // Determine which page the user should see and redirect to it
  redirectToRelevantPage(){
    // Show the loading dialog
    this.showLoadingDialog();

    // If the user has no active profile, show the profile edit screen
    this.userService.hasActiveProfile(this.authService.getUserToken(), this.authService.getUser(), (isActive : boolean) => {
      if(!isActive){
        // Hide the loading dialog
        this.closeLoadingDialog();

        // Redirect to edit profile
        window.open('/home/user/edit-profile', '_self');
      } else {
        // If the user has homie requests to approve, redirect to the homies screen
        this.homiesService.getUsersPendingHomieRequestCount(this.authService.getUserToken(), this.authService.getUser(), (success: boolean, count: number) => {
          if(count > 0){
            // Hide the loading dialog
            this.closeLoadingDialog();

            // Redirect to edit profile
            window.open('/home/homies', '_self');
          } else {
            // Check if the user has any homies
            this.homiesService.getUsersHomies(this.authService.getUserToken(), this.authService.getUser(), (res: any) => {
              // Hide the loading dialog
              this.closeLoadingDialog();

              // Redirect to messages if they have homies and to search otherwise
              if(res.homies.length > 0){
                window.open('/home/messages', '_self');
              } else {
                window.open('/home/search', '_self');
              }
            });
          }
        });
      }
    });
  }
}
