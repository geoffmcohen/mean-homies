import { Component, OnInit } from '@angular/core';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from '@angular/material';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';
import { AuthenticationService } from '../../auth/authentication.service';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-ban-user',
  templateUrl: './ban-user.component.html',
  styleUrls: ['./ban-user.component.css']
})
export class BanUserComponent implements OnInit {

  public targetUser: string;
  public banType: string;
  public banPeriod: number;
  public banPeriodUnit: string;
  public banComment: string;
  public message: string;

  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService,
    private userService: UserService
  ) { }

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

  // Clears the form fields
  clearFields(){
    this.targetUser = null;
    this.banType = null;
    this.banPeriod = null;
    this.banPeriodUnit = null;
    this.banComment = null;
  }

  checkFields() : boolean{
    if(!this.targetUser && !this.banType){
      this.message = "Target User and Ban Type are required";
      return false;
    } else if (this.banType == "temporary" && (!this.banPeriod || !this.banPeriodUnit)){
      this.message = "For temporary bans, Ban Period and Ban Period Unit are  requried.";
      return false;
    } else {
      return true;
    }
  }

  // Submits the form
  submitBan(){
    if(this.checkFields()){
      this.message = null;

      // Show the loading dialog
      this.showLoadingDialog();

      // Make the service call to ban the user
      this.userService.banUser(
        this.authService.getAdminToken(),
        this.authService.getAdminUser(),
        this.targetUser,
        this.banType,
        this.banPeriod,
        this.banPeriodUnit,
        this.banComment,
        (res : any) => {
          // Hide the loading dijalog
          this.closeLoadingDialog();

          if(res.success){
            // Clear the fields
            this.clearFields();

            // Diplay a snackbar with the result
            this.snackBar.open(res.message, "Close", {duration: 5000});
          } else {
            // Show the error message
            this.message = res.message;
          }
        }
      );
    }
  }
}
