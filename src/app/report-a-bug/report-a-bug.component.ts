import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FingerprintjsProAngularService } from '@fingerprintjs/fingerprintjs-pro-angular';
import { ComplaintService } from '../services/complaint.service';
import { GameService } from '../services/game.service';

@Component({
    selector: 'app-report-a-bug',
    templateUrl: './report-a-bug.component.html',
    styleUrls: ['./report-a-bug.component.css']
})
export class ReportABugComponent implements OnInit {
    reportForm = new FormGroup({
        formEmail: new FormControl('', [
            Validators.required,
            Validators.email,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
        formComplaint: new FormControl('', Validators.required)
    });
    submitted = false;

    constructor(private dialogRef: DialogRef<string>, 
        private gameService: GameService, 
        private complaintService: ComplaintService,
        private fingerprintService: FingerprintjsProAngularService) {
    }

    ngOnInit(): void {
    }

    async onSubmit(email: string, complaint: string) {
        this.submitted = true;
        if (this.reportForm.invalid) {
            return;
        }
        if(!localStorage.getItem("visitorId")){
            const data = await this.fingerprintService.getVisitorData();
            localStorage.setItem("visitorId", data.visitorId);
        }
        this.complaintService.fileComplaint(localStorage.getItem("visitorId")!, email, complaint).subscribe(result => {
            if (result) {
                alert("Your mail has been sent.");
                this.dialogRef.close();
            } else {
                alert("You've sent a complaint just recently. Please wait a couple hours and try again. Sorry for the inconvenience!");
                this.dialogRef.close();
            }});
    }

    get f() {
        return this.reportForm.controls;
    }

    close() {
        this.dialogRef.close();
    }
}
