import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { ModalService } from '../../shared/modal.service';
import { AuthenticationService } from '../../auth/authentication.service'

@Component({
  selector: 'app-admin-user-area',
  templateUrl: './admin-user-area.component.html',
  styleUrls: ['./admin-user-area.component.css']
})
export class AdminUserAreaComponent implements OnInit {
  @Output() loggedInOutput = new EventEmitter<boolean>();

  public username: string;
  public password: string;
  public message: string;
  public loggedIn: boolean;
  public loggedInUser: string;

  constructor(
    private modalService: ModalService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.loggedIn = this.authService.checkAdminIsLoggedIn();
    if(this.loggedIn){
      this.loggedInUser = this.authService.getAdminUser();
    }
  }

  // Used to show login form
  openModal(id: string) {
    this.modalService.open(id);
  }

  // Used to hide login form
  closeModal(id: string) {
    this.modalService.close(id);
  }

  // Attempt logging in
  submitLoginForm(id: string){
    // Close login form and show loading dialog
    this.closeModal(id);
    this.openModal("admin-login-loading-dialog");

    // Make call to auth services
    this.authService.adminLogin(this.username, this.password, (res : any) => {
        console.log("Trying to login %s", this.username);
        console.log(res);

        this.message = null;

        // If successful store token or something
        if(res.success){
          // Set the loggedIn flag and username
          this.loggedIn = true;
          this.loggedInUser = this.authService.getAdminUser();

          // Alert parent that user has logged in
          this.notifyLoginChange();

          // Remove username and password from form
          this.username = "";
          this.password = "";

          // Close the login form
          this.closeModal("admin-login-loading-dialog");
        } else {
            this.closeModal("admin-login-loading-dialog");
            this.password = "";
            this.message = res.message;
            this.openModal(id);
        }
    });
  }

  // Allow user to log out
  logout(){
    this.authService.adminLogout();
    this.loggedIn = false;
    this.loggedInUser = null;

    // Alert parent that user has logged out
    this.notifyLoginChange();
  }

  notifyLoginChange(){
    this.loggedInOutput.emit(this.loggedIn);
  }
}
