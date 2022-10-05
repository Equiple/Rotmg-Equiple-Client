import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, Inject } from '@angular/core';
import { ModalData } from './modal-data';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {
  constructor(public dialogRef: DialogRef<string>, @Inject(DIALOG_DATA) public data: ModalData) { 
  }

  // @Input() title: string = '';
  // @Input() body: string = '';
  // @Input() bgColor: string ='';
  // @Input() imgLink: string ='';
  // @Output() closeMeEvent = new EventEmitter();
  // @Output() confirmEvent = new EventEmitter();

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  // closeMe(){
  //   this.closeMeEvent.emit();
  // }

  // confirm(){
  //   this.confirmEvent.emit();
  // }

}
