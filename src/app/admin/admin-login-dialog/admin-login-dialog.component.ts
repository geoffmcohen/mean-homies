import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material";
import { AuthenticationService } from '../../auth/authentication.service';

@Component({
  selector: 'app-admin-login-dialog',
  templateUrl: './admin-login-dialog.component.html',
  styleUrls: ['./admin-login-dialog.component.css']
})
export class AdminLoginDialogComponent implements OnInit {
  public username: string;
  public password: string;
  public message: string;
  public isLoading: boolean;

  constructor(
    private dialogRef: MatDialogRef<AdminLoginDialogComponent>,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.isLoading = false;
  }

  submitLoginForm() {
    // #TODO: We should use the loading dialog here instead of this
    // Show loading
    this.isLoading = true;

    // Make call to auth services
    this.authService.adminLogin(this.username, this.password, (res : any) => {
      this.isLoading = false;
      this.message = null;

      if(res.success){
        // Return a true if successfully logged in
        this.dialogRef.close( true );
      } else {
        // Otherwise reset the password and reshow dialog
        this.password = "";
        this.message = res.message;
      }
    });
  }

}
