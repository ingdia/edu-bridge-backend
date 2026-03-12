import type { UpdateProfileInput, MentorNotesInput } from '../validators/profile.validator';
export declare const getStudentProfile: (userId: string, requesterRole: string) => Promise<any>;
export declare const updateStudentProfile: (userId: string, data: UpdateProfileInput, requesterId: string, requesterRole: string, ipAddress?: string) => Promise<any>;
export declare const updateMentorNotes: (userId: string, data: MentorNotesInput, requesterId: string, requesterRole: string, ipAddress?: string) => Promise<any>;
export declare const getAllStudents: (requesterId: string, filters?: {
    district?: string;
    gradeLevel?: string;
}) => Promise<any[]>;
//# sourceMappingURL=profile.service.d.ts.map