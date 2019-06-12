import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material";
import { AuthenticationService } from '../../auth/authentication.service';
import { UserService } from '../../user/user.service';
import { SearchService } from '../search.service';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public loggedIn: boolean;
  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;

  public nearRadioValue: string;
  public nearLocation: string;
  public distance: string;
  public distanceUnit: string;
  public message: string;

  public searchResults: any[];

  constructor(
      private authService: AuthenticationService,
      private userService: UserService,
      private searchService: SearchService,
      private dialog: MatDialog
    ) { }

  ngOnInit() {
    // Get initial login state and track changes
    this.subscribeToLoginChanges();

    // Set default values
    this.nearRadioValue = "me";
    this.distance = "5";
    this.distanceUnit = "Miles";
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

  // Displays a loading dialog
  showLoadingDialog(){
    // Create the loading dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    // Show the loading dialog
    this.loadingDialogRef = this.dialog.open(LoadingDialogComponent, dialogConfig);
  };

  // Closes the loading dialog
  closeLoadingDialog(){
    this.loadingDialogRef.close();
  }

  // Performs search for other users
  performSearch(){
    // #TODO: Make sure field values are appropriate
    
    // Show the loading dialog
    this.showLoadingDialog();
    this.message = null;
    this.searchResults = null;

    // Set useMiles flag based on distanceUnit
    var useMiles = true;
    if(this.distanceUnit != 'Miles') useMiles = false;

    // Make the appropriate call to the search service
    if(this.nearRadioValue == 'me'){
      this.searchService.searchForUsersNearUser(this.authService.getUserToken(), this.authService.getUser(), parseInt(this.distance), useMiles, (res: any) => {
        this.handleSearchResults(res);
      });

    } else {
      this.searchService.searchForUsersNearLocation(this.authService.getUserToken(), this.authService.getUser(), this.nearLocation, parseInt(this.distance), useMiles, (res: any) => {
        this.handleSearchResults(res);
      });
    }
  }

  // Function called in callback of the search functions
  handleSearchResults(res: any){
    // Hide the loading dialog
    this.closeLoadingDialog();

    // Set the results or the message depending on which came back
    if(res.nearbyProfiles){
      this.searchResults = res.nearbyProfiles;

      // #TODO: Add user images
    } else {
      this.message = res.message;
    }
  }

}
