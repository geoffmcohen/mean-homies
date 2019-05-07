import { Component, OnInit } from '@angular/core';

import { ModalService } from '../../shared/modal.service';
import { AuthenticationService } from '../../auth/authentication.service'

@Component({
  selector: 'app-admin-user-area',
  templateUrl: './admin-user-area.component.html',
  styleUrls: ['./admin-user-area.component.css']
})
export class AdminUserAreaComponent implements OnInit {
  public username: string;
  public password: string;
  public message: string;
  public loggedIn: boolean;

  constructor(
    private modalService: ModalService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    // NOT SURE IF THIS IS BEING CALLED APPROPRIATLEY
    this.loggedIn = this.checkLoggedIn();
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
    // Make call to auth services
    //this.authService.adminLogin(this.username, this.password).subscribe((res : any) => {
    this.authService.adminLogin(this.username, this.password, (res : any) => {
        console.log("Trying to login %s", this.username);
        console.log(res);

        this.message = null;

        // If successful store token or something
        if(res.success){
          this.loggedIn = true;

          // Remove username and password
          this.username = "";
          this.password = "";

          // Close the login form
          this.closeModal(id);
        } else {
            this.password = "";
            this.message = res.message;
        }
    });
  }

  // // Allow user to log out
  // logout(){
  //   localStorage.removeItem('admin_user');
  //   localStorage.removeItem('admin_user_token')
  // }

  // Check if user is logged in
  checkLoggedIn(): boolean{
    console.log('checkLoggedIn called');
    return this.authService.checkAdminIsLoggedIn();
  }
}
