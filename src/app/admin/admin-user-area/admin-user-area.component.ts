import { Component, OnInit } from '@angular/core';

import { ModalService } from '../../shared/modal.service';

@Component({
  selector: 'app-admin-user-area',
  templateUrl: './admin-user-area.component.html',
  styleUrls: ['./admin-user-area.component.css']
})
export class AdminUserAreaComponent implements OnInit {

  constructor(private modalService: ModalService) { }

  ngOnInit() {
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}
