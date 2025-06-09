import React, { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import TaskFormFields from '@/components/task-form-fields';

interface Task {
    id: number;
    title: string;
    description: string | null;
    type: string | null;
    status: 'open' | 'in_progress' | 'closed';
    due_date: string | null; // YYYY-MM-DD format from server for date input
}

interface EditProps {
    task: Task;
}

export default function Edit({ task }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        title: task.title || '',
        description: task.description || '',
        type: task.type || '',
        status: task.status || 'open',
        due_date: task.due_date ? task.due_date.substring(0, 10) : '', // Format for <input type="date">
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('tasks.update', task.id));
    };

    return (
        <AuthLayout title="Edit Task" description="Edit an existing task" >
            <Head title="Edit Task" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 md:p-8">
                            <form onSubmit={submit}>
                                <TaskFormFields data={data} setData={setData} errors={errors} />
                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        Update Task
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
