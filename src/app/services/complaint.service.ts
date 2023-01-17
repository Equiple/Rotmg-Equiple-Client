import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Complaint } from "src/lib/api";
import { ComplaintsService as ComplaintsServiceAPI } from "src/lib/api/api/complaints.service";

@Injectable()
export class ComplaintService {
    constructor(private gameServiceAPI: ComplaintsServiceAPI) {
    }

    fileComplaint(author: string, complaint: string): Observable<any>{
        return this.gameServiceAPI.complaintsFileComplaintPost(author, complaint);
    }

    removeComplaint(complaintId: string): Observable<any>{
        return this.gameServiceAPI.complaintsRemoveComplaintPost(complaintId);
    }

    getComplaints(): Observable<Complaint[]> {
        return this.gameServiceAPI.complaintsGetComplaintsGet();
    }
}