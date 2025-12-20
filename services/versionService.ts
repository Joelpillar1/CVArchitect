// Version Service - Stub for now
// Will be implemented when resume_versions table is added

export interface ResumeVersion {
    id: string;
    resume_id: string;
    version_number: number;
    content: any;
    created_at: string;
}

export const versionService = {
    async getVersions(resumeId: string): Promise<ResumeVersion[]> {
        // Stub - return empty array
        return [];
    },

    async createVersion(resumeId: string, content: any): Promise<void> {
        // Stub
    },

    async restoreVersion(versionId: string): Promise<any> {
        // Stub
        return null;
    },
};
