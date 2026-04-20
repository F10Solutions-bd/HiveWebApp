/* eslint-disable @typescript-eslint/no-explicit-any */
import { IoAddCircle, IoRemoveCircle } from 'react-icons/io5';
import FormModal from '@/components/modal/FormModal';
import { Load } from '@/features/load/types';
import { NoteForm } from '@/features/load/hooks/useLoadNotes';

interface LoadNoteEditProps {
    activeNoteTab: 'general' | 'timestamp' | 'compare';
    setActiveNoteTab: (tab: 'general' | 'timestamp' | 'compare') => void;
    generalNoteForms: NoteForm[];
    handleGeneralNoteFormUpdate: (id: number, field: string, value: any) => void;
    handleGeneralNoteFormRemove: (id: number) => void;
    handleGeneralNoteFormAdd: () => void;
    setCurrentTaskContext: (context: { id: number; type: 'sales' | 'operator' } | null) => void;
    setIsOpenTaskModal: (isOpen: boolean) => void;
    isOpenTaskModal: boolean;
    newTask: { description: string; priority: string };
    setNewTask: (task: { description: string; priority: string }) => void;
    handleTaskSave: () => void;
    load: Load | null;
    setLoad: React.Dispatch<React.SetStateAction<Load | null>>;
}

export const LoadNoteEdit: React.FC<LoadNoteEditProps> = ({
    activeNoteTab,
    setActiveNoteTab,
    generalNoteForms,
    handleGeneralNoteFormUpdate,
    handleGeneralNoteFormRemove,
    handleGeneralNoteFormAdd,
    setCurrentTaskContext,
    setIsOpenTaskModal,
    isOpenTaskModal,
    newTask,
    setNewTask,
    handleTaskSave,
    load,
    setLoad,
}) => {
    return (
        <div className="w-full bg-bg p-4 rounded-lg mt-5">
            {/* Title */}
            <h2 className="text-center text-[18px] xl:text-xl mb-2">Notes</h2>

            {/* Note Tabs Start */}
            <div className="flex gap-2 mb-4">
                <div className="bg-secondary p-0.5 rounded-md">
                    <button
                        onClick={() =>
                            setActiveNoteTab('general')
                        }
                        className={` text-[13px] xl:text-sm !py-0.5 ${activeNoteTab === 'general'
                            ? 'btn-primary'
                            : 'btn-secondary'
                            }`}
                    >
                        General Notes
                    </button>

                    <button
                        onClick={() =>
                            setActiveNoteTab('timestamp')
                        }
                        className={` text-[13px] xl:text-sm !py-0.5 ${activeNoteTab === 'timestamp'
                            ? 'btn-primary'
                            : 'btn-secondary'
                            }`}
                    >
                        Timestamp Notes
                    </button>
                </div>

                <button
                    onClick={() => setActiveNoteTab('compare')}
                    className={` text-[13px] xl:text-sm !py-0.5 !rounded-xl ${activeNoteTab === 'compare'
                        ? 'btn-primary'
                        : 'btn-secondary'
                        }`}
                >
                    Compare
                </button>
            </div>
            {/* Note Tabs End */}

            {/* General Notes Start */}
            {activeNoteTab === 'general' && (
                <div className="">
                    <div className="border-1 border-secondary rounded-lg p-2">
                        {generalNoteForms.map((form, index) => {
                            if (form.isDeleted) return null;
                            return (
                                <div key={form.id} className="relative mb-4">
                                    {index > 0 && <hr className="text-secondary mb-4" />}
                                    <div className="flex flex-wrap items-center gap-4 mb-2">
                                        <label className="flex items-center gap-2 text-[13px] xl:text-sm">
                                            <input
                                                type="checkbox"
                                                checked={form.notifySales}
                                                onChange={(e) => handleGeneralNoteFormUpdate(form.id, 'notifySales', e.target.checked)}
                                                className="accent-primary !h-[19px] !w-[19px] cursor-pointer"
                                            />
                                            Notify Sales Rep
                                        </label>

                                        {form.salesTaskId ? (
                                            <span className="text-[13px] xl:text-sm font-medium text-primary underline cursor-pointer">
                                                Task Created
                                            </span>
                                        ) : (
                                            <button
                                                className="text-[13px] xl:text-sm !py-1 btn-secondary !rounded-xl"
                                                onClick={() => {
                                                    setCurrentTaskContext({ id: form.id, type: 'sales' });
                                                    setIsOpenTaskModal(true);
                                                }}
                                            >
                                                Create Action - Sales
                                            </button>
                                        )}

                                        <label className="flex items-center gap-2 text-[13px] xl:text-sm">
                                            <input
                                                type="checkbox"
                                                checked={form.notifyOperator}
                                                onChange={(e) => handleGeneralNoteFormUpdate(form.id, 'notifyOperator', e.target.checked)}
                                                className="accent-primary !h-[19px] !w-[19px] cursor-pointer"
                                            />
                                            Notify Operator
                                        </label>

                                        {form.operatorTaskId ? (
                                            <span className="text-[13px] xl:text-sm font-medium text-primary underline cursor-pointer">
                                                Task Created
                                            </span>
                                        ) : (
                                            <button
                                                className="text-[13px] xl:text-sm !py-1 btn-secondary !rounded-xl"
                                                onClick={() => {
                                                    setCurrentTaskContext({ id: form.id, type: 'operator' });
                                                    setIsOpenTaskModal(true);
                                                }}
                                            >
                                                Create Action - Operator
                                            </button>
                                        )}

                                        {generalNoteForms.filter(f => !f.isDeleted).length > 1 && (
                                            <button
                                                onClick={() => handleGeneralNoteFormRemove(form.id)}
                                                className="ml-auto"
                                                title="Remove Note"
                                            >
                                                <IoRemoveCircle className='cursor-pointer text-danger' size={22} />
                                            </button>
                                        )}
                                    </div>

                                    <textarea
                                        value={form.noteText}
                                        onChange={(e) => handleGeneralNoteFormUpdate(form.id, 'noteText', e.target.value)}
                                        placeholder="New Note:"
                                        className="!text-[13px] xl:!text-sm !rounded-md w-full !p-1 min-h-[50px] resize-none !outline-none !border !border-transparent focus:!border-primary focus:ring-0"
                                    />
                                </div>
                            )
                        })}

                        <div className="flex justify-center">
                            <button
                                onClick={handleGeneralNoteFormAdd}
                                className="btn-secondary !py-0.5 !pl-5 !pr-0.5 !rounded-xl flex items-center justify-center gap-2"
                            >
                                <div className="text-[13px] xl:text-sm w-[100px] text-center">Add Note</div>
                                <IoAddCircle className="w-[26px] h-[26px] text-primary" />
                            </button>
                        </div>

                        <FormModal
                            isOpen={isOpenTaskModal}
                            onClose={() => setIsOpenTaskModal(false)}
                            headline="Create Task"
                            className="!text-[16px] xl:!text-lg"
                        >
                            <div className="flex flex-col gap-4 mt-2 px-4 w-[500px]">
                                <div className="flex flex-col gap-1 text-[13px] xl:text-sm">
                                    <label>Description:</label>
                                    <textarea
                                        className="w-full h-[80px] border border-gray-300 rounded p-2"
                                        value={newTask.description}
                                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1 text-[13px] xl:text-sm">
                                    <label>Priority:</label>
                                    <select
                                        className="w-full border border-gray-300 rounded p-2"
                                        value={newTask.priority}
                                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                    >
                                        <option value="">Select Priority</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                                <div className="flex justify-center mt-4 mb-2">
                                    <button onClick={() => { handleTaskSave(); setIsOpenTaskModal(false); }} className="btn-primary !h-8 px-6 !rounded-md text-[13px] xl:text-sm">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </FormModal>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-[13px] xl:text-sm font-medium mb-2">
                            General Notes
                        </h3>
                        <textarea
                            value={load?.generalNotes || ''}
                            onChange={(e) => setLoad(prev => prev ? { ...prev, generalNotes: e.target.value } : null)}
                            placeholder=""
                            className="!text-[13px] xl:!text-sm w-full !p-2 !min-h-[250px] !rounded-lg resize-none !border-1 !border-secondary focus:!border-primary focus:ring-0"
                        />
                    </div>
                </div>
            )}
            {/* General Notes End */}

            {/* Timestamp Notes Start */}
            {activeNoteTab === 'timestamp' && (
                <div className="mt-2">
                    <h3 className="text-[13px] xl:text-sm font-medium mb-2">
                        Timestamp Notes
                    </h3>
                    <textarea
                        value={load?.timestampNotes || ''}
                        onChange={(e) => setLoad(prev => prev ? { ...prev, timestampNotes: e.target.value } : null)}
                        placeholder=""
                        className="!text-[13px] xl:!text-sm w-full !p-2 !min-h-[320px] !rounded-lg resize-none !border-1 !border-secondary focus:!border-primary focus:ring-0"
                    />
                </div>
            )}
            {/* Timestamp Notes End */}

            {/* Compare Notes Start */}
            {activeNoteTab === 'compare' && (
                <div className="mt-2 flex justify-between gap-3">
                    <div className="w-[50%]">
                        <h3 className="text-center text-[13px] xl:text-sm font-medium mb-2">
                            General Notes
                        </h3>
                        <textarea
                            value={load?.generalNotes || ''}
                            onChange={(e) => setLoad(prev => prev ? { ...prev, generalNotes: e.target.value } : null)}
                            placeholder=""
                            className="!text-[13px] xl:!text-sm w-full !p-2 !min-h-[320px] !rounded-lg resize-none !border-1 !border-secondary focus:!border-primary focus:ring-0"
                        />
                    </div>
                    <div className="w-[50%]">
                        <h3 className="text-center text-[13px] xl:text-sm font-medium mb-2">
                            Timestamp Notes
                        </h3>
                        <textarea
                            value={load?.timestampNotes || ''}
                            onChange={(e) => setLoad(prev => prev ? { ...prev, timestampNotes: e.target.value } : null)}
                            placeholder=""
                            className="!text-[13px] xl:!text-sm w-full !p-2 !min-h-[320px] !rounded-lg resize-none !border-1 !border-secondary focus:!border-primary focus:ring-0"
                        />
                    </div>
                </div>
            )}
            {/* Compare Notes End */}
        </div>
    );
};