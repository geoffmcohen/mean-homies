import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Subscription } from 'rxjs';
import { ApplicationStateService } from '../../shared/application-state.service';
import { AuthenticationService } from '../../auth/authentication.service';
import { UserService } from '../../user/user.service';
import { HomiesService } from '../../homies/homies.service';
import { MessagesService } from '../../messages/messages.service';
import { PageStatsService } from '../../shared/page-stats.service';
import { LoginDialogComponent } from '../../user/login-dialog/login-dialog.component';
import { SignupDialogComponent } from '../../user/signup-dialog/signup-dialog.component';
import { UserAgreementDialogComponent } from '../../user/user-agreement-dialog/user-agreement-dialog.component';
import { ChangePasswordDialogComponent } from '../../user/change-password-dialog/change-password-dialog.component';
import { UserPreferencesDialogComponent } from '../../user/user-preferences-dialog/user-preferences-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, OnDestroy {
  public isMobile: boolean;
  public isBaseClass: boolean = this.constructor.name == "HomeComponent";
  public loggedIn: boolean;
  public loggedInUser: string;
  public hasActiveProfile: boolean;
  public pendingHomieRequestCount: number;
  public unreadMessageCount: number;

  private subscriptions: Subscription[] = [];

  constructor(
    private dialog: MatDialog,
    private appStateService: ApplicationStateService,
    private authService: AuthenticationService,
    private userService: UserService,
    private homiesService: HomiesService,
    private msgService: MessagesService,
    private pageStatsService: PageStatsService
  ) {
    // Gets whether a mobile device is being used
    this.isMobile = this.appStateService.getIsMobile();
  }

  ngOnInit() {
    // Increment page stats for home page
    this.pageStatsService.incrementPageCount( "home" );

    if(!this.isBaseClass){
      // Get initial login state and track changes
      this.subscribeToLoginChanges();
    }
  }

  // Unsubscribes to all observables before closing
  ngOnDestroy(){
    for(var i = 0; i < this.subscriptions.length; i++){
      this.subscriptions[i].unsubscribe();
    }
  }

  // Set up login state and subscribe to changes
  subscribeToLoginChanges(){
    // Get the initial state of the login
    this.loggedIn = this.authService.checkUserIsLoggedIn();
    if(this.loggedIn){
      this.loggedInUser = this.authService.getUser();

      // Subscribe to all other data change events
      this.subscribeToChanges();
    }

    // Subscribe to login changes
    this.subscriptions.push(this.authService.userLoginChange.subscribe(loggedIn => {
      this.loggedIn = loggedIn;
      if(this.loggedIn){
        this.loggedInUser = this.authService.getUser();

        // Subscribe to all other data change events
        this.subscribeToChanges();
      } else {
        this.loggedInUser = null;
      }
    }));
  }

  subscribeToChanges(){
    // Get the inital state of active profile and track changes
    this.subscribeToHasActiveProfileChanges();

    // Get the initial count of homie requests and track changes
    this.subscribeToHomieRequestChanges();

    // Gets the count of unread meassges and tracks changes
    this.subscribeToMessageChanges();
  }

  // Setup profile active state and subscribe to changes
  subscribeToHasActiveProfileChanges(){
    // Get initial state of hasActiveProfile
    this.userService.hasActiveProfile(this.authService.getUserToken(), this.authService.getUser(), (isActive : boolean) => {
      this.hasActiveProfile = isActive;

      // Subscribe to changes in active profile
      this.subscriptions.push(this.userService.hasActiveProfileChange.subscribe(hasActiveProfile => {
        this.hasActiveProfile = hasActiveProfile;
      }));
    });
  }

  // Subscribes to the count of active homie requests to display as a badge
  subscribeToHomieRequestChanges(){
    // Get initial state of pendingHomieRequestCount
    this.homiesService.getUsersPendingHomieRequestCount(this.authService.getUserToken(), this.authService.getUser(), (success: boolean, count: number) => {
      this.pendingHomieRequestCount = count;

      // Subscribe to changes to the change in homie request count
      this.subscriptions.push(this.homiesService.pendingRequestCountChange.subscribe((newCount) => {
        this.pendingHomieRequestCount = newCount;
      }));
    });
  }

  // Subscibes to the count of messages
  subscribeToMessageChanges(){
    // Get the initial count of unread messages
    this.msgService.getUnreadMessageCount(this.authService.getUserToken(), this.authService.getUser(), (res: any) => {
      if(res.success){
        // Set the initial count and subscribe to changes in the count
        this.unreadMessageCount = res.count;

        // Subscribe to changes in the unread messagse count
        this.subscriptions.push(this.msgService.unreadMessageCountChange.subscribe(count => {
          this.unreadMessageCount = count;
        }));
      }
    });
  }

  showLoginDialog(){
    // Create the login dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    // Set mobile take up entire screen
    if (this.isMobile){
      dialogConfig.minWidth = "100vw";
      dialogConfig.height = "100vh";
    }

    // Show the dialog for login
    this.dialog.open(LoginDialogComponent, dialogConfig)
  }

  showSignupDialog(){
    // Create the config to be used for the dialogs
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    // Set mobile take up entire screen
    if (this.isMobile){
      dialogConfig.minWidth = "100vw";
      dialogConfig.height = "100vh";
    }

    // Show user agreement first and only display signup if accepted
    var userAgreementDialogRef = this.dialog.open(UserAgreementDialogComponent, dialogConfig);
    userAgreementDialogRef.afterClosed().subscribe(userAgrees => {
      if(userAgrees){
        // Show the dialog for sign up
        var signupDialogRef = this.dialog.open(SignupDialogComponent, dialogConfig)
      }
    })
  }

  // Shows the dialog used for updating the users password
  showChangePasswordDialog(){
    // Show the dialog for the user to update their password
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    // Set mobile take up entire screen
    if (this.isMobile){
      dialogConfig.minWidth = "100vw";
      dialogConfig.height = "100vh";
    }

    // Show the change password dialog
    this.dialog.open(ChangePasswordDialogComponent, dialogConfig);
  }

  // Shows the dialog to update the users Preferences
  showUserPreferencesDialog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;

    // Set mobile take up entire screen
    if (this.isMobile){
      dialogConfig.minWidth = "100vw";
      dialogConfig.height = "100vh";
    }

    // Show the user preferences dialog
    this.dialog.open(UserPreferencesDialogComponent, dialogConfig);
  }

  // Opens up the blog in a new window
  openBlog(){
    window.open('/blog', '_blank');
  }

  // Allow user to log out
  logout(){
    // Log the user out
    this.authService.userLogout();

    // Redirect to home page
    window.open('/home', '_self');
  }

  // Gets the number of alerts to show as a badge on the menu button
  getTotalAlertCount(){
    return this.pendingHomieRequestCount + this.unreadMessageCount;
  }

  // Determines if a badge should be shown on the menu button
  shouldHideMenuBadge(){
    var totalAlerts = this.getTotalAlertCount();
    if(totalAlerts != null && totalAlerts > 0){
      return false;
    } else {
      return true;
    }
  }
}
