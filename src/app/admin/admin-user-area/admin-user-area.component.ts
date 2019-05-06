import { Component, OnInit } from '@angular/core';

import { ModalService } from '../../shared/modal.service';

@Component({
  selector: 'app-admin-user-area',
  templateUrl: './admin-user-area.component.html',
  styleUrls: ['./admin-user-area.component.css']
})
export class AdminUserAreaComponent implements OnInit {
  public username: string;
  public password: string;

  constructor(private modalService: ModalService) { }

  ngOnInit() {
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
    console.log("User '%s' attempted to login", this.username);

    // Make call to auth services
    // If successful store token or something
    // If failure redisplay the dialog with a message and remove password
    this.username = "";
    this.password = "";

    // Close the login form
    this.closeModal(id);
  }

}
