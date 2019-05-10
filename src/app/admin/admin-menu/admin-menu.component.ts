import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css']
})
export class AdminMenuComponent implements OnInit {
  @Output() displayComponentOutput = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  displayComponent(componentInfo: any){
    this.displayComponentOutput.emit(componentInfo);
  }
}
