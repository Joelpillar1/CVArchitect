// Cover Letter Service - Stub for now
// Will be implemented when cover letters table is added

export interface SavedCoverLetter {
    id: string;
    user_id: string;
    title: string;
    content: any;
    created_at: string;
    updated_at: string;
}

export const coverLetterService = {
    async getCoverLetters(userId: string): Promise<SavedCoverLetter[]> {
        // Stub - return empty array
        return [];
    },

    async saveCoverLetter(userId: string, title: string, content: any): Promise<string> {
        // Stub - return mock ID
        return 'mock-id';
    },

    async updateCoverLetter(id: string, title: string, content: any): Promise<void> {
        // Stub
    },

    async deleteCoverLetter(id: string): Promise<void> {
        // Stub
    },
};
