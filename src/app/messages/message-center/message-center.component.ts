import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material";
import { Subscription } from 'rxjs';
import { ApplicationStateService } from '../../shared/application-state.service';
import { AuthenticationService } from '../../auth/authentication.service';
import { UserService } from '../../user/user.service';
import { HomiesService } from '../../homies/homies.service';
import { MessagesService } from '../messages.service';
import { PageStatsService } from '../../shared/page-stats.service';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';
import { MessengerDialogComponent } from '../../messages/messenger-dialog/messenger-dialog.component';

@Component({
  selector: 'app-message-center',
  templateUrl: './message-center.component.html',
  styleUrls: ['./message-center.component.css']
})
export class MessageCenterComponent implements OnInit, OnDestroy {
  public isMobile: boolean;
  public isBaseClass: boolean = this.constructor.name == "MessageCenterComponent";
  public loggedIn: boolean;
  public hasActiveProfile: boolean;

  public homies: string[];
  public latestMessages: any[];
  public homieToMessage: string;

  private homiesLoading: boolean;
  private messagesLoading: boolean;
  private homiesProfileMap: any;
  private messagesProfileMap: any;

  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;
  private messengerDialogRef: MatDialogRef<MessengerDialogComponent>;
  private subscriptions: Subscription[] = [];

  constructor(
    private appStateService: ApplicationStateService,
    private authService: AuthenticationService,
    private userService: UserService,
    private homiesService: HomiesService,
    private msgService: MessagesService,
    private pageStatsService: PageStatsService,
    private dialog: MatDialog
  ) {
    // Records the user activity
    this.pageStatsService.recordPageStats("messages", this.authService.getUser(), this.isMobile);

    // Gets whether a mobile device is being used
    this.isMobile = appStateService.getIsMobile();
  }

  ngOnInit() {
    if (!this.isBaseClass){
      // Get initial login state and track changes
      this.subscribeToLoginChanges();
    }
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

      // Subscribe to new messages
      this.subscriptions.push(this.msgService.newMessageInfo.subscribe(msgInfo => {
        this.getNewMessage(msgInfo);
      }));

      // Subscribe to message read notifications
      this.subscriptions.push(this.msgService.messageMarkedAsRead.subscribe(updateData => {
        this.markMessageAsRead(updateData);
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
    this.homiesProfileMap = null;
    this.messagesProfileMap = null;
  }

  // Gets the latest message in each conversation
  getLatestMessages(showLoading){
    if(this.loggedIn){
      // Set message loading flag so loading screen isn't prematurely closed
      this.messagesLoading = true;

      // Show loading dialog
      if (showLoading) this.showLoadingDialog();

      // Check if the user has an active profile
      this.userService.hasActiveProfile(this.authService.getUserToken(), this.authService.getUser(), (hasActiveProfile) => {
        // Set the active profile status
        this.hasActiveProfile = hasActiveProfile;

        // If the profile is active, get the homies
        if(this.hasActiveProfile){
          this.msgService.getLatestMessages(this.authService.getUserToken(), this.authService.getUser(), (res : any) => {
            if(res.success){
              // Build a list of users to get the profiles for
              var users = [];
              for(var i = 0; i < res.messages.length; i++){
                var user = res.messages[i].sendUser == this.authService.getUser() ? res.messages[i].receiveUser : res.messages[i].sendUser;
                users.push(user);
              }

              // Get the profiles for these users
              this.userService.getUserProfiles(this.authService.getUserToken(), this.authService.getUser(), users, (profileRes : any) => {
                // Set the profile map for the messages
                if(profileRes.success) this.messagesProfileMap = profileRes.profilesByUsername;

                // Set the messages
                this.latestMessages = res.messages;

                // Set message loading flag to false to indicate that messages are done loading
                this.messagesLoading = false;

                // Hide the loading dialog
                if (showLoading && !this.homiesLoading) this.closeLoadingDialog();
              });
            }
          });
        }
      });
    }
  }

  // Gets the homies
  getHomies(showLoading){
    if(this.loggedIn){
      // Set the homies loading flag to true to make sure loading isn't prematurely closed
      this.homiesLoading = true;

      // Show loading dialog
      if(showLoading) this.showLoadingDialog();

      // Get the homies
      this.homiesService.getUsersHomies(this.authService.getUserToken(), this.authService.getUser(), (res : any) => {
        if(res.success){
          // Get the list of homies
          this.homies = res.homies;

          this.userService.getUserProfiles(this.authService.getUserToken(), this.authService.getUser(), this.homies,  (res : any) => {
            // Get the profile mapping for the homies
            if(res.success) this.homiesProfileMap = res.profilesByUsername;
            // Set homies loading flag to false to indicate homies is done loading
            this.homiesLoading = false;

            // Hide the loading dialog if neccessary
            if(showLoading && !this.messagesLoading) this.closeLoadingDialog();
          });
        } else {
          // Set homies loading flag to false to indicate homies is done loading
          this.homiesLoading = false;

          // Hide the loading dialog if neccessary
          if(showLoading && !this.messagesLoading) this.closeLoadingDialog();
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

  // Gets the user profile for a message
  // #TODO: Handle not found better
  getProfileForMessage(msg){
    return this.messagesProfileMap[this.authService.getUser() == msg.sendUser ? msg.receiveUser : msg.sendUser];
  }

  // Gets a new message for the screen
  getNewMessage(msgInfo){
    this.msgService.getMessage(this.authService.getUserToken(), this.authService.getUser(), msgInfo.sendUser, msgInfo.receiveUser, msgInfo.sendTimestamp, false, (res : any) => {
      if(res.success){
        // Check if the profile is needed for a new message
        if(!this.getProfileForMessage(res.message)){
          // Add the users profile first
          var user = this.authService.getUser() == msgInfo.sendUser ? msgInfo.receiveUser : msgInfo.sendUser;
          this.userService.getUserProfile(this.authService.getUserToken(), this.authService.getUser(), user, (profileRes : any) => {
            this.messagesProfileMap[user] = profileRes.profile;

            // Now add the message
            this.addNewMessage(res.message);
          });
        } else {
          this.addNewMessage(res.message);
        }
      }
    });
  }

  // Adds a new message to the latest messages
  addNewMessage(message){
    // Remove the previous message in this conversation if it exists
    this.latestMessages = this.latestMessages.filter((msg : any) => {
      return msg.conversationId != message.conversationId;
    });

    // Add the new message
    this.latestMessages.push(message);

    // Sort the messages
    this.latestMessages.sort((a, b) => {
      return b.sendTimestamp - a.sendTimestamp;
    });
  }

  // Marks a message as read
  markMessageAsRead(updateData){
    // Loop through the messagess to find the relevant message
    for(var i = this.latestMessages.length - 1; i >= 0; i--){
      // Check if it's for this conversation
      if(this.latestMessages[i].conversationId == updateData.conversationId){
        // Only update it if it's this specific message
        if(this.latestMessages[i].sendTimestamp == updateData.sendTimestamp){
          this.latestMessages[i].readTimestamp = updateData.readTimestamp;
          this.latestMessages[i].status = updateData.status;
        }
        break;
      }
    }
  }

  // Creates a formatted version of the homies name as 'username - "displayName"'
  formatHomieName(homie){
    var profile = this.homiesProfileMap[homie];
    if(profile && profile.displayName){
      return homie + " - \"" + profile.displayName + "\""
    } else {
      return homie;
    }
  }

  sendHomieMessage(){
    // Create dialog configs for messenger dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = { profile: this.homiesProfileMap[this.homieToMessage] };

    // Set mobile take up entire screen
    if (this.isMobile){
      dialogConfig.minWidth = "100vw";
      dialogConfig.height = "100vh";
    } else {
      dialogConfig.minWidth = "768px";
      dialogConfig.maxWidth = "768px";
    }

    // Show the messenger dialog
    this.messengerDialogRef = this.dialog.open(MessengerDialogComponent, dialogConfig);
  }
}
