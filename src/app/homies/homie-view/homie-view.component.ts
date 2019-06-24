import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from "@angular/material";
import { AuthenticationService } from '../../auth/authentication.service';
import { UserService } from '../../user/user.service';
import { HomiesService } from '../../homies/homies.service';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';
import { ProfileViewDialogComponent } from '../../user/profile-view-dialog/profile-view-dialog.component';

@Component({
  selector: 'app-homie-view',
  templateUrl: './homie-view.component.html',
  styleUrls: ['./homie-view.component.css']
})
export class HomieViewComponent implements OnInit {
  @Input() homie: string;
  public profile: any;
  public profileImage: string;

  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;
  private profileDialogRef: MatDialogRef<ProfileViewDialogComponent>;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private homiesService: HomiesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Set the profile image to the default
    this.profileImage = '../../../assets/images/default profile.gif';

    // Get the profile and profile image
    this.userService.getUserProfile(this.authService.getUserToken(), this.homie, (res : any) => {
      if(res.success) this.profile = res.profile;

      this.userService.getUserProfilePicture(this.authService.getUserToken(), this.homie, (res : any) => {
        if(res.success) this.profileImage = res.imageUrl;
      });
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

  // Displays the profile dialog
  showProfileDialog(){
    // Create the profile display dialog
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {profile: this.profile};
    dialogConfig.minWidth = "90%";

    // Show the profile dislay dialog
    this.profileDialogRef = this.dialog.open(ProfileViewDialogComponent, dialogConfig);
  }

  sendHomieMessage(){ console.log("sendHomieMessage() called"); }
  removeHomie(){ console.log("removeHomie() called"); }
}
