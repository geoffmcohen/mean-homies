import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css']
})
export class AdminMenuComponent implements OnInit {
  @Output() displayComponentOutput = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  displayComponent(componentName: string){
    this.displayComponentOutput.emit(componentName);
  }
}
