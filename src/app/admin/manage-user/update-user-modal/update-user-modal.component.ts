import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-update-user-modal',
  templateUrl: './update-user-modal.component.html',
  styleUrls: ['./update-user-modal.component.css']
})
export class UpdateUserModalComponent implements OnInit {

  @Input()
  my_modal_title!: string;

  @Input()
  my_modal_content!: string;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {

  }

}
