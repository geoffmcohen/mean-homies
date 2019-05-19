import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from "@angular/material";
import { UserService } from '../user.service';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-signup-dialog',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.css']
})
export class SignupDialogComponent implements OnInit {
  public email: string;
  public username: string;
  public password:  string;
  public passwordConfirm:  string;
  public message: string;
  private loadingDialogRef: MatDialogRef<LoadingDialogComponent>;

  constructor(
    private dialogRef: MatDialogRef<SignupDialogComponent>,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  submitSignupForm(){
    // Show the loading dialog
    this.showLoadingDialog();

    this.userService.createUser(this.email, this.username, this.password, (res: any) => {
      // Hide the loading dialog
      this.closeLoadingDialog();
      this.message = null;

      // Close this dialog and show snackbar if successful
      if(res.success){
        this.dialogRef.close();
        this.snackBar.open(res.message, "Close");
      } else {
        this.password = "";
        this.passwordConfirm = "";
        this.message = res.message;
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

}
