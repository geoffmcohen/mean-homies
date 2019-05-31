import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from "@angular/material";
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { AuthenticationService } from '../../auth/authentication.service';
import { UserService } from '../user.service';
import { MapsService } from '../../maps/maps.service';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  public loggedIn: boolean;
  public loggedInUser: string;
  public message: string;
  public lat: number;
  public lng: number;
  public city: string;
  public stateProvince: string;
  public country: string;
  public locationError: string;
  public showMap: boolean;
  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;

  displayName = new FormControl('', []);
  location = new FormControl('', []);
  aboutMe = new FormControl('', []);
  lookingToMeet = new FormControl('', []);

  public locationTooltipText: string = `Instead of your home address, you can enter in the name or address of a local business in your neighborhood like "Erewhon Venice Beach", the name of a local landmark like "Brooklyn Borough Hall" or a combination of your city, state/province and country like "San Francisco, California, USA".`;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private MapsService: MapsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Get initial login state and track changes
    this.subscribeToLoginChanges();

    // If logged in, get and set the existing values
    if(this.loggedIn){
      // Show loading dialog
      this.showLoadingDialog();

      this.userService.getUserProfile(this.loggedInUser, (res : any) => {
        // Hide loading dialog
        this.closeLoadingDialog();

        // If a profile exists, set the form values
        if(res.success){
          this.displayName.setValue(res.profile.displayName);
          this.aboutMe.setValue(res.profile.aboutMe);
          this.lookingToMeet.setValue(res.profile.lookingToMeet);

          // If we have the location display it
          if(res.profile.location){
            this.location.setValue(res.profile.location.locationEntered);
            this.lat = res.profile.location.lat;
            this.lng = res.profile.location.lng;
            this.city = res.profile.location.city;
            this.stateProvince = res.profile.location.stateProvince;
            this.country = res.profile.location.country;
            this.showMap = true;
          }
        }
      });
    }
  }

  // Set up login state and subscribe to changes
  subscribeToLoginChanges(){
    // Get the initial state of the login
    this.loggedIn = this.authService.checkUserIsLoggedIn();
    if(this.loggedIn){
      this.loggedInUser = this.authService.getUser();
    }

    // Subscribe to login changes
    this.authService.userLoginChange.subscribe(loggedIn => {
      this.loggedIn = loggedIn;
      if(this.loggedIn){
        this.loggedInUser = this.authService.getUser();
      } else {
        this.loggedInUser = null;
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

  // Attempts to save the users profile
  saveProfile(){
    // If the user has entered a location but not been located
    if (this.location.value && (!this.lat || !this.lng)){
      this.locationError = "Please hit the 'Find Me' button to find your location.";
    } else {
      // Show loading dialog
      this.showLoadingDialog();

      // Make the call to the user service to save the profile
      this.userService.saveUserProfile(
        this.loggedInUser,
        this.displayName.value,
        this.aboutMe.value,
        this.lookingToMeet.value,
        this.location.value,
        this.lat,
        this.lng,
        this.city,
        this.stateProvince,
        this.country,
        (res : any) => {
        // Hide loading dialog
        this.closeLoadingDialog();
        this.message = null;

        if(res.success){
          // Display a Snackbar with message
          this.snackBar.open(res.message, "Close");
        } else {
          // Display the error message in the message section
          this.message = res.message;
        }
      });
    }
  }

  // Attempts to find the location on the map
  findLocation(){
    if(!this.location.value){
      this.locationError = "Please enter a location first."
    } else {
      // Show loading dialog
      this.showLoadingDialog();

      // Clear all location fields
      this.clearLocationFields();
      this.message = null;

      // Make the service call to Google geocoder api
      this.MapsService.findLocation(this.location.value, (res : any) => {
        // Hide the loading dialog
        this.closeLoadingDialog();

        if(res.status == "OK"){
          var foundLocation = res.results[0];

          // Find the latitude and longitude of the input value
          this.lat = foundLocation.geometry.location.lat;
          this.lng = foundLocation.geometry.location.lng;

          // Find the city, state/province and country from the results
          foundLocation.address_components.forEach((ac) => {
            ac.types.forEach((act) => {
              if(act == "locality" || act == "sublocality"){
                this.city = ac.long_name;
              } else if (act == "administrative_area_level_1"){
                this.stateProvince = ac.short_name;
              } else if (act == "country"){
                this.country = ac.short_name;
              }
            });
          });

          // Display the map
          this.showMap = true;
        } else {
          // Show the error below the text box
          this.locationError = "Unable to find your location with Google Maps";

          // Hide the map if it was already shown
          this.showMap = false;
        }
      });
    }
  }

  // Clear all location fields
  clearLocationFields(){
    this.lat = null;
    this.lng = null;
    this.city = null;
    this.stateProvince = null;
    this.country = null;
    this.locationError = null;
  }
}
