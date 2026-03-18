// dto/workstation-request.dto.ts
export class WorkstationRequestDto {
    id: string;
    createdAt: Date;
    workTopic: string;
    workType: string;
    status: string;
    adminNote?: string | null;

    studentFirstName: string;
    studentLastName: string;
    studentIdm: string;
    studentEmail: string;

    mitarbeiterId: string;
    mitarbeiterName: string;

    constructor(entity: any) {
        this.id = entity.id;
        this.createdAt = entity.createdAt;
        this.workTopic = entity.workTopic;
        this.workType = entity.workType;
        this.status = entity.status;
        this.adminNote = entity.adminNote;

        this.studentFirstName = entity.studentFirstName;
        this.studentLastName = entity.studentLastName;
        this.studentIdm = entity.studentIdm;
        this.studentEmail = entity.studentEmail;

        this.mitarbeiterId = entity.mitarbeiterId;
        this.mitarbeiterName = entity.mitarbeiter.name;
    }
}
