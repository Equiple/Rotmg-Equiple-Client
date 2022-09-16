import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {
  constructor() { 

  }

  @Input() title: string = '';
  @Input() body: string = '';
  @Input() bgColor: string ='';
  @Input() imgLink: string ='';
  @Output() closeMeEvent = new EventEmitter();
  @Output() confirmEvent = new EventEmitter();

  ngOnInit(): void {
    console.log('Modal init');
  }

  ngOnDestroy(): void {
    console.log('Modal destroyed');
  }

  closeMe(){
    this.closeMeEvent.emit();
  }

  confirm(){
    this.confirmEvent.emit();
  }

}
