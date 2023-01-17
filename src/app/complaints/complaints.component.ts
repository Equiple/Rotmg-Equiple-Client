import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Complaint } from 'src/lib/api';
import { ComplaintService } from '../services/complaint.service';
import { GameService } from '../services/game.service';

@Component({
    selector: 'app-complaints',
    templateUrl: './complaints.component.html',
    styleUrls: ['./complaints.component.css']
})
export class ComplaintsComponent implements OnInit {
    complaints = new Array<Complaint>();
    @Input() hideControls : Boolean = false;

    constructor(private complaintService: ComplaintService, private router: Router) {
    }

    ngOnInit(): void {
        this.getComplaints();
    }

    getComplaints(){
        this.complaintService.getComplaints().subscribe(complaints => {
            if(complaints){
                this.complaints = complaints;
            }
        });
    }

    remove(complaintId: string){
        this.complaintService.removeComplaint(complaintId).subscribe(() => {
            this.getComplaints();
        });
    }
}
