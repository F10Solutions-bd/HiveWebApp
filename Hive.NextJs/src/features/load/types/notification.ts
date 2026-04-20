export interface Notification {
    id?: number;
    loadId: number;
    description?: string;
    salesTaskId?: number;
    operatorTaskId?: number;
    isSalesNotify: boolean;
    isOperatorNotify: boolean;
    isDeleted: boolean;
}