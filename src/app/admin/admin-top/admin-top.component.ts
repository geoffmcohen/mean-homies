import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-top',
  templateUrl: './admin-top.component.html',
  styleUrls: ['./admin-top.component.css']
})
export class AdminTopComponent implements OnInit {
  @Output() loggedInOutput = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  notifyLoginChange($event){
    this.loggedInOutput.emit($event);
  }
}
