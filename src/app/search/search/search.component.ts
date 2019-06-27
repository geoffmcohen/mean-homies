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
  public hasActiveProfile: boolean;
  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;

  public nearRadioValue: string;
  public nearLocation: string;
  public distance: string;
  public distanceUnit: string;
  public message: string;

  public pageSize = 10;
  public currentPage = 0;
  public searchResults: any[];
  public pagedResults: any[];

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

    // If the user is logged in, see if they have an active profile
    this.checkIfUserHasActiveProfile();

    // Subscribe to login changes
    this.authService.userLoginChange.subscribe(loggedIn => {
      this.loggedIn = loggedIn;

      // Clears the search results if not logged in
      if(!loggedIn){
        this.clearSearchResults();
      } else {
        // Otherwise set the active profile flag
        this.checkIfUserHasActiveProfile();
      }
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
    // Make sure field values are appropriate
    if(this.validateSearchInput()){

      // Show the loading dialog
      this.showLoadingDialog();
      this.clearSearchResults();

      // Set useMiles flag based on distanceUnit
      var useMiles = true;
      if(this.distanceUnit != 'Miles') useMiles = false;

      // Make the appropriate call to the search service
      if(this.nearRadioValue == 'me'){
        this.searchService.searchForUsersNearUser(this.authService.getUserToken(), this.authService.getUser(), Number(this.distance), useMiles, (res: any) => {
          this.handleSearchResults(res);
        });

      } else {
        this.searchService.searchForUsersNearLocation(this.authService.getUserToken(), this.authService.getUser(), this.nearLocation, Number(this.distance), useMiles, (res: any) => {
          this.handleSearchResults(res);
        });
      }
    }
  }

  // Function called in callback of the search functions
  handleSearchResults(res: any){
    // Hide the loading dialog
    this.closeLoadingDialog();

    // Set the results or the message depending on which came back
    if(res.nearbyProfiles){
      this.searchResults = res.nearbyProfiles;

      // Paginate the results
      this.paginateResults();
    } else {
      this.message = res.message;
    }
  }

  // Clears the search results
  clearSearchResults(){
    this.searchResults = null;
    this.pagedResults = null;
    this.message = null;
  }

  // Checks input fields
  validateSearchInput(){
    if(this.nearRadioValue == 'location' && !this.nearLocation){
      this.message = "Please enter a 'Location' for the search.";
      return false;
    } else if (!/^\d+(\.\d+)?$/.test(this.distance)){
      this.message = "Please enter a valid number for 'Distance'."
      return false;
    } else {
      return true;
    }
  }

  // Sets the hasActiveProfile flag if a user is logged in
  checkIfUserHasActiveProfile(){
    if(this.loggedIn){
      // Show loading screen
      this.showLoadingDialog();

      // Check if the user has an active profile
      this.userService.hasActiveProfile(this.authService.getUserToken(), this.authService.getUser(), (hasActiveProfile) => {
        // Set the active profile status
        this.hasActiveProfile = hasActiveProfile;

        // Close the loading dialog
        this.closeLoadingDialog();
      });
    }
  }

  // Handles changes in paginator
  handlePage(event: any){
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginateResults();
  }

  // Setup paged data
  paginateResults(){
    // Determine the beginning and end of the paged array
    var start = this.currentPage * this.pageSize;
    var end = start + this.pageSize;
    if(end > this.searchResults.length) end = this.searchResults.length;

    // Create a subarray for the paged data
    this.pagedResults = this.searchResults.slice(start, end);
  }
}
