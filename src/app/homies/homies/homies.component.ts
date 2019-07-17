import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material";
import { Subscription } from 'rxjs';
import { ApplicationStateService } from '../../shared/application-state.service';
import { AuthenticationService } from '../../auth/authentication.service';
import { UserService } from '../../user/user.service';
import { HomiesService } from '../homies.service';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-homies',
  templateUrl: './homies.component.html',
  styleUrls: ['./homies.component.css']
})
export class HomiesComponent implements OnInit {
  public isMobile: boolean;
  public loggedIn: boolean;
  public hasActiveProfile: boolean;
  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;
  private subscriptions: Subscription[];

  public pendingHomieRequests: any[];
  public waitingHomieRequests: any[];
  public homies: any[];

  constructor(
    private appStateService: ApplicationStateService,
    private authService: AuthenticationService,
    private userService: UserService,
    private homiesService: HomiesService,
    private dialog: MatDialog
  ) {
    // Gets whether a mobile device is being used
    this.isMobile = this.appStateService.getIsMobile();
  }

  ngOnInit() {
    // Create the array of subscriptions
    this.subscriptions = [];

    // Get initial login state and track changes
    this.subscribeToLoginChanges();
  }

  // Set up login state and subscribe to changes
  subscribeToLoginChanges(){
    // Get the initial state of the login
    this.loggedIn = this.authService.checkUserIsLoggedIn();

    // If the user is logged in, get the data for the screen
    this.getData();

    // Subscribe to changes in pending and waiting homie requests
    this.subscribeToHomieRequestChanges();

    // Subscribe to login changes
    this.subscriptions.push(this.authService.userLoginChange.subscribe(loggedIn => {
      this.loggedIn = loggedIn;

      // Clears the homies if not logged in
      if(!loggedIn){
        this.clearData();
      } else {
        // Otherwise get the data for the screen
        this.getData();

        // Subscribe to changes in pending and waiting homie requests
        this.subscribeToHomieRequestChanges();
      }
    }));
  }

  // Subscribe to changes in pending and waiting homie requests
  subscribeToHomieRequestChanges(){
    if(this.loggedIn){
      // Refresh the data if pending count changes
      this.subscriptions.push(this.homiesService.pendingRequestCountChange.subscribe(count => {
        this.getData();
      }));

      // Refresh the data if waiting count changes
      this.subscriptions.push(this.homiesService.waitingRequestCountChange.subscribe(count => {
        this.getData();
      }));

      // Remove a homie from the list
      this.subscriptions.push(this.homiesService.removeUserFromHomies.subscribe(username => {
        this.homies = this.homies.filter(function(value, index, arr){
          return value != username;
        });
      }));
    }
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
  };

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

  // Gets the data for the screen
  getData(){
    if(this.loggedIn){
      // Show loading dialog
      this.showLoadingDialog();

      // Check if the user has an active profile
      this.userService.hasActiveProfile(this.authService.getUserToken(), this.authService.getUser(), (hasActiveProfile) => {
        // Set the active profile status
        this.hasActiveProfile = hasActiveProfile;

        // If the profile is active, get the homies
        if(this.hasActiveProfile){
          this.homiesService.getUsersHomies(this.authService.getUserToken(), this.authService.getUser(), (res: any) => {
            if(res.success){
              // Set the homies
              this.homies = res.homies;

              // Now get any homie requests
              this.homiesService.getUsersHomieRequests(this.authService.getUserToken(), this.authService.getUser(), (res: any) => {
                if(res.success){
                  // Set the pending and waiting requests
                  this.pendingHomieRequests = res.homieRequests.pending;
                  this.waitingHomieRequests = res.homieRequests.waiting;
                } else {
                  // #TODO: Figure out what to do in case of error
                }
                // Hide the loading dialog
                this.closeLoadingDialog();
              });
            } else {
              // #TODO: Figure out what to do in case of error
              // Hide the loading dialog
              this.closeLoadingDialog();
            }
          });
        } else {
          // Hide the loading dialog
          this.closeLoadingDialog();
        }
      });
    }
  }

  // Clears all of the screen data
  clearData(){
    this.hasActiveProfile = null;
    this.homies = null;
    this.pendingHomieRequests = null;
    this.waitingHomieRequests = null;
  }

  // Unsubscribes to all observables before closing
  ngOnDestroy(){
    for(var i = 0; i < this.subscriptions.length; i++){
      this.subscriptions[i].unsubscribe();
    }
  }
}
