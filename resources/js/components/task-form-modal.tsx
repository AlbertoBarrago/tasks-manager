import TaskFormFields from '@/components/task-form-fields';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import React, { Fragment, useEffect } from 'react';
import { TaskFormData } from '@/interfaces';

interface Task {
    id: number;
    title: string;
    description: string | null;
    type: string | null;
    status: 'open' | 'in_progress' | 'closed';
    due_date: string | null;
}

interface TaskFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskToEdit?: Task | null;
    onSuccess?: () => void;
}

export default function TaskFormModal({ isOpen, onClose, taskToEdit, onSuccess }: TaskFormModalProps) {
    const isEditing = !!taskToEdit;

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm<TaskFormData>({
        title: taskToEdit?.title || '',
        description: taskToEdit?.description || '',
        type: taskToEdit?.type || '',
        status: taskToEdit?.status || 'open',
        due_date: taskToEdit?.due_date ? taskToEdit.due_date.substring(0, 10) : '',
    });

    useEffect(() => {
        if (isOpen) {
            setData({
                title: taskToEdit?.title || '',
                description: taskToEdit?.description || '',
                type: taskToEdit?.type || '',
                status: taskToEdit?.status || 'open',
                due_date: taskToEdit?.due_date ? taskToEdit.due_date.substring(0, 10) : '',
            });
            clearErrors();
        }
    }, [isOpen, taskToEdit, clearErrors, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                reset();
                onClose();
                if (onSuccess) onSuccess();
            },
            preserveScroll: true,
        };

        if (isEditing && taskToEdit) {
            put(route('tasks.update', taskToEdit.id), options);
        } else {
            post(route('tasks.store'), options);
        }
    };

    const handleCloseModal = () => {
        reset();
        clearErrors();
        onClose();
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleCloseModal}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30 dark:bg-black/70" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800">
                                <DialogTitle as="h3" className="mb-4 text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                                    {isEditing ? 'Edit Task' : 'Create New Task'}
                                </DialogTitle>
                                <form onSubmit={handleSubmit}>
                                    <TaskFormFields data={data} setData={setData} errors={errors} />
                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className={`rounded-md px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                                                isEditing
                                                    ? 'bg-yellow-500 hover:bg-yellow-600 focus-visible:ring-yellow-500'
                                                    : 'bg-green-500 hover:bg-green-600 focus-visible:ring-green-500'
                                            } ${processing ? 'cursor-not-allowed opacity-50' : ''}`}
                                            disabled={processing}
                                        >
                                            {processing ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
                                        </button>
                                    </div>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
