import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from "@angular/material";
import { ApplicationStateService } from '../../shared/application-state.service';
import { AuthenticationService } from '../../auth/authentication.service';
import { UserService } from '../user.service';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-picture-upload-dialog',
  templateUrl: './picture-upload-dialog.component.html',
  styleUrls: ['./picture-upload-dialog.component.css']
})
export class PictureUploadDialogComponent implements OnInit {
  public isMobile: boolean;
  public imageFilename: string;
  public imageFile: File;
  public message: string;
  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;

  constructor(
    private dialogRef: MatDialogRef<PictureUploadDialogComponent>,
    private appStateService: ApplicationStateService,
    private authService: AuthenticationService,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Gets whether a mobile device is being used
    this.isMobile = this.appStateService.getIsMobile();
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

  // Used to set the image file to upload
  onFileChange(event){
    this.imageFile = event.target.files.item(0);
  }

  // Clears the image selection
  clearSelectedFile(){
    this.imageFilename = null;
    this.imageFile = null;
  }

  // Uploads the users file and sets it as their profile picture
  uploadImage(){
    // Check if an image file was chosens
    if(!this.imageFile){
      this.message = "Please click 'Choose File' button and select an image.";
    } else {
      // Show loading dialog
      this.showLoadingDialog();

      // Make service call to upload
      this.userService.uploadUserProfilePicture(
        this.authService.getUserToken(),
        this.authService.getUser(),
        this.imageFile,
        (res : any) => {
        // Hide loading dialog
        this.closeLoadingDialog();
        this.message = null;

        // If failure display message
        if(!res.success){
          this.message = res.message;
        } else {
          // Show snackbar with message
          this.snackBar.open(res.message, "Close", {duration: 5000});

          // Close dialog with a success
          this.dialogRef.close(true);
        }
      });
    }
  }

  // Use for a close button on mobile
  close(){
    this.dialogRef.close(false);
  }
}
