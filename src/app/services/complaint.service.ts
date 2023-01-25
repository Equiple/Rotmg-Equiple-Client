import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Complaint } from "src/lib/api";
import { ComplaintService as ComplaintServiceAPI } from "src/lib/api/api/complaint.service";

@Injectable()
export class ComplaintService {
    constructor(private gameServiceAPI: ComplaintServiceAPI) {
    }

    fileComplaint(fingerprint: string, author: string, complaint: string): Observable<boolean>{
        return this.gameServiceAPI.complaintsFileComplaintPost(fingerprint, author, complaint);
    }

    removeComplaint(complaintId: string): Observable<any>{
        return this.gameServiceAPI.complaintsRemoveComplaintPost(complaintId);
    }

    getComplaints(): Observable<Complaint[]> {
        return this.gameServiceAPI.complaintsGetComplaintsGet();
    }
}