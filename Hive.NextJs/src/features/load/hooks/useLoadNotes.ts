import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Load, Notification } from '@/features/load/types';
import api from '@/services/apiClient';

// Make sure to define note form interface to keep it clean.
export interface NoteForm {
    id: number;
    notificationId: number;
    notifySales: boolean;
    notifyOperator: boolean;
    noteText: string;
    isDeleted: boolean;
    salesTaskId?: number;
    operatorTaskId?: number;
}

export const useLoadNotes = (
    id: string | string[],
    load: Load | null
) => {

    // Tasks
    const [currentTaskContext, setCurrentTaskContext] = useState<{ id: number; type: 'sales' | 'operator' } | null>(null);
    const [newTask, setNewTask] = useState({ description: '', priority: '' });

    // General Notes
    const [generalNoteForms, setGeneralNoteForms] = useState<NoteForm[]>([
        { id: Date.now(), notificationId: 0, notifySales: false, notifyOperator: false, noteText: '', isDeleted: false, salesTaskId: 0, operatorTaskId: 0 }
    ]);

    const handleTaskSave = async () => {
        if (!currentTaskContext || !load) return;
        const assignedTo = currentTaskContext.type === 'sales' ? load.salesRepId : load.operatorId;
        try {
            const res = await api.post<{ id: number }>('/taskItems', {
                assignedTo,
                description: newTask.description,
                priority: newTask.priority,
            });
            const newTaskId = res.data?.id || 1;
            const updatedForms = generalNoteForms.map(form => {
                if (form.id === currentTaskContext.id) {
                    return {
                        ...form,
                        ...(currentTaskContext.type === 'sales' ? { salesTaskId: newTaskId } : { operatorTaskId: newTaskId })
                    };
                }
                return form;
            });
            setGeneralNoteForms(updatedForms);
            toast.success('Task saved successfully');
        } catch (error) {
            console.error('Failed to save task', error);
        }
    };

    const handleGeneralNoteFormAdd = () => {
        setGeneralNoteForms((prev) => [
            ...prev,
            { id: Date.now() + Math.random(), notificationId: 0, notifySales: false, notifyOperator: false, noteText: '', isDeleted: false, salesTaskId: 0, operatorTaskId: 0 }
        ]);
    };

    const handleGeneralNoteFormRemove = (formId: number) => {
        setGeneralNoteForms((prev) =>
            prev.map(form => form.id === formId ? { ...form, isDeleted: true } : form)
        );
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleGeneralNoteFormUpdate = (formId: number, field: string, value: any) => {
        setGeneralNoteForms((prev) =>
            prev.map((form) =>
                form.id === formId ? { ...form, [field]: value } : form
            )
        );
    };

    const fetchLoadNotificationData = async () => {
        try {
            const { data: notificationData } = await api.get<Notification[]>(`/loads/load-notifications/${id}`);
            console.log("notificationData", notificationData);

            if (notificationData?.length) {
                setGeneralNoteForms(
                    notificationData.map((n, idx) => ({
                        id: Date.now() + idx,
                        notificationId: n.id || 0,
                        notifySales: n.isSalesNotify,
                        notifyOperator: n.isOperatorNotify,
                        noteText: n.description || '',
                        isDeleted: n.isDeleted || false,
                        salesTaskId: n.salesTaskId,
                        operatorTaskId: n.operatorTaskId
                    }))
                );
            }
        } catch {
            toast.error('Error fetching load notifications:');
        }
    };

    return {
        // Tasks
        currentTaskContext, setCurrentTaskContext,
        newTask, setNewTask,
        handleTaskSave,

        // Notes
        generalNoteForms, setGeneralNoteForms,
        handleGeneralNoteFormAdd, handleGeneralNoteFormRemove, handleGeneralNoteFormUpdate,
        fetchLoadNotificationData
    };
};
