// src/common/errors/student-already-assigned.error.ts
export class StudentAlreadyAssignedError extends Error {
  constructor(
    public readonly studentId: string,
    public readonly computerName: string,
  ) {
    super(
      `Student ${studentId} ist bereits einem Computer (${computerName}) zugeordnet`,
    );
    this.name = 'StudentAlreadyAssignedError';
  }
}
