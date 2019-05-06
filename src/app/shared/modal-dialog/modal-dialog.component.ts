import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

import { ModalService } from '../modal.service';

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.css']
})
export class ModalDialogComponent implements OnInit, OnDestroy {
  @Input() id: string;
  private element: any;

  constructor(private modalService: ModalService, private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit(): void {
    let modal = this;

    // Ensure id attribute exists
    if(!this.id){
      console.error('modal must have id');
      return;
    }

    // Add element to the bottom of the page so it can be displayed above everything useNewUrlParser
    document.body.appendChild(this.element);

    // Close modal on background click
    this.element.addEventListener('click', function (e: any){
      if(e.target.className === 'modal-dialog'){
        modal.close();
      }
    });

    // Add self to the modal service so that it's accessable from controllers
    this.modalService.add(this);
  }

  // Remove self from modal service when component is destroyed
  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
  }

  // Open modal
  open(): void {
    this.element.style.display = 'block';
    document.body.classList.add('modal-dialog-open');
  }

  // Close modal
  close(): void {
    this.element.style.display = 'none';
    document.body.classList.remove('modal-dialog-open');
  }
}
