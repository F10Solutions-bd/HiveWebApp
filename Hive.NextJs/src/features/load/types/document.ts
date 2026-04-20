export interface Document {
    id: number;
    categoryName: string;
    fileType: string;
    fileName: string;
    filePath: string;
    uploadedBy: number;
    uploadedAt: string;
    isDeleted: boolean;
}