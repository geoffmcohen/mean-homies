import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatSnackBar } from '@angular/material';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';
import { AuthenticationService } from '../../auth/authentication.service';
import { HomiesService } from '../../homies/homies.service';

@Component({
  selector: 'app-create-homie-request-dialog',
  templateUrl: './create-homie-request-dialog.component.html',
  styleUrls: ['./create-homie-request-dialog.component.css']
})
export class CreateHomieRequestDialogComponent implements OnInit {
  public profile: any;
  public message: string;
  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;

  requestMessage = new FormControl('', []);

  constructor(
    private authService: AuthenticationService,
    private homiesService: HomiesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CreateHomieRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.profile = data.profile
  }

  ngOnInit() {
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

  // Create Homie Request
  sendHomieRequest(){
      // Show loading dialog
      this.showLoadingDialog();
      this.message = null;

      // Attempt to create the homie request
      this.homiesService.sendHomieRequest(
        this.authService.getUserToken(),
        this.authService.getUser(),
        this.profile.username,
        this.requestMessage.value,
        (res : any) => {
        // Hide the loading dialog
        this.closeLoadingDialog();

        if(res.success){
          // Display a snackBar
          this.snackBar.open(res.message, "Close", {duration: 5000});

          // Close this dialog
          this.dialogRef.close(true);
        } else {
          this.message = res.message;
        }
      });
  }
}
