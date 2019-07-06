import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material";
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../auth/authentication.service';
import { UserService } from '../../user/user.service';
import { HomiesService } from '../../homies/homies.service';
import { MessagesService } from '../messages.service';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-message-center',
  templateUrl: './message-center.component.html',
  styleUrls: ['./message-center.component.css']
})
export class MessageCenterComponent implements OnInit {
  public loggedIn: boolean;
  public hasActiveProfile: boolean;

  public homies: string[];
  public latestMessages: any[];
  public profilesByUsername: any;

  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;
  private subscriptions: Subscription[];

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private homiesService: HomiesService,
    private msgService: MessagesService,
    private dialog: MatDialog
  ) { }

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

    // Subscribe to changes in messages
    this.subscribeToMessageChanges();

    // Subscribe to changes in Homies
    this.subscribeToHomieChanges();

    // Subscribe to login changes
    this.subscriptions.push(this.authService.userLoginChange.subscribe(loggedIn => {
      this.loggedIn = loggedIn;

      // Clears the data if not logged in
      if(!loggedIn){
        this.clearData();
      } else {
        // Subscribe to changes in messages
        this.subscribeToMessageChanges();

        // Subscribe to changes in Homies
        this.subscribeToHomieChanges();
      }
    }));
  }

  // Gets the latest messages and adds subscriptions to get new messages to and from the user
  subscribeToMessageChanges(){
    if(this.loggedIn){
      // Get the messages
      this.getLatestMessages(true);

      // Subscribe to new messages to the user
      this.subscriptions.push(this.msgService.newMessageFrom.subscribe(sendUser => {
        this.getLatestMessages(false);
      }));

      // Subscribe to new messages from the user
      this.subscriptions.push(this.msgService.newMessageFrom.subscribe(receiveUser => {
        this.getLatestMessages(false);
      }));
    }
  }

  // Gets the list of homies and subscribes to changes in homies
  subscribeToHomieChanges(){
    // Gets the list of homies for the new message box
    this.getHomies(true);

    // Subscribe to see if the user possibly accepted a new homie
    this.subscriptions.push(this.homiesService.pendingRequestCountChange.subscribe(count => {
      this.getHomies(false);
    }));

    // Subscribe to see if the another user accepted this users homie request
    this.subscriptions.push(this.homiesService.waitingRequestCountChange.subscribe(count => {
      this.getHomies(false);
    }));

    // Subscribe to see if the user removed a homie or another user removed them as a homie
    this.subscriptions.push(this.homiesService.removeUserFromHomies.subscribe(userToRemove => {
      // Remove this user from the homies
      this.homies = this.homies.filter(function(value, index, arr){
        return value != userToRemove;
      });

      // Remove this users profile from the list of profiles
      delete this.profilesByUsername[userToRemove];
    }));
  }

  // Unsubscribes to all observables before closing
  ngOnDestroy(){
    for(var i = 0; i < this.subscriptions.length; i++){
      this.subscriptions[i].unsubscribe();
    }
  }

  // Clears the screen data
  clearData(){
    this.latestMessages = null;
    this.homies = null;
    this.profilesByUsername = null;
  }

  // Gets the latest message in each conversation
  getLatestMessages(showLoading){
    if(this.loggedIn){
      // Show loading dialog
      if (showLoading) this.showLoadingDialog();

      // Check if the user has an active profile
      this.userService.hasActiveProfile(this.authService.getUserToken(), this.authService.getUser(), (hasActiveProfile) => {
        // Set the active profile status
        this.hasActiveProfile = hasActiveProfile;

        // If the profile is active, get the homies
        if(this.hasActiveProfile){
          this.msgService.getLatestMessages(this.authService.getUserToken(), this.authService.getUser(), (res : any) => {
            // Set the messages if successful
            if(res.success) this.latestMessages = res.messages;

            // Hide the loading dialog
            if (showLoading) this.closeLoadingDialog();
          });
        }
      });
    }
  }

  // Gets the homies
  getHomies(showLoading){
    if(this.loggedIn){
      // Show loading dialog
      if (showLoading) this.showLoadingDialog();

      // Get the homies
      this.homiesService.getUsersHomies(this.authService.getUserToken(), this.authService.getUser(), (res : any) => {
        if(res.success){
          // Get the list of homies
          this.homies = res.homies;

          // Get the profile for each homie
          this.profilesByUsername = {};
          for(var i = 0; i < this.homies.length; i++){
            // Get the profile
            this.userService.getUserProfile(this.authService.getUserToken(), this.authService.getUser(), this.homies[i], (res : any) => {
              if(res.success){
                // Set the profile for this user
                this.profilesByUsername[res.profile.username] = res.profile;

                // If we've done all of them, then remove the loading dialog
                if (showLoading && this.homies.length == Object.keys(this.profilesByUsername).length) this.closeLoadingDialog();
              }
            });
          }
        } else {
          // Hide the loading dialog
          if (showLoading) this.closeLoadingDialog();
        }
      });
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
}
