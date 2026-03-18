// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type WorkstationRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type WorkstationRequest = {
    id: string;
    createdAt: string;
    workTopic: string;
    workType: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    adminNote?: string | null;

    studentFirstName: string;
    studentLastName: string;
    studentIdm: string;
    studentEmail: string;

    mitarbeiterId: string;
    mitarbeiterName: string;
};

export async function fetchWorkstationRequests(): Promise<WorkstationRequest[]> {
    const res = await fetch(`${API_URL}/workstation-requests`, {
        cache: 'no-store',
    });
    if (!res.ok) {
        throw new Error('Fehler beim Laden der Anträge');
    }
    return res.json();
}

export async function updateWorkstationRequestStatus(
    id: number,
    action: 'approve' | 'reject',
    adminNote?: string,
): Promise<WorkstationRequest> {
    const res = await fetch(`${API_URL}/workstation-requests/${id}/${action}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminNote }),
    });
    if (!res.ok) {
        throw new Error('Fehler beim Aktualisieren des Antrags');
    }
    return res.json();
}
