// resources/js/pages/Tasks/Create.tsx
import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import TaskFormFields from '@/components/task-form-fields';
import { TaskFormData } from '@/pages/tasks/index';



export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm<TaskFormData>({
        title: '',
        description: '',
        type: '',
        status: 'open',
        due_date: ''
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tasks.store'), {
            onSuccess: () => reset(), // Reset form on success
        });
    };

    return (
        <AuthLayout title="Add Task" description="Create a new task">
            <Head title="Add Task" />

            <div className="py-2">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 md:p-8">
                            <form onSubmit={submit}>
                                <TaskFormFields data={data} setData={setData} errors={errors} />
                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                                        disabled={processing}
                                    >
                                        Create Task
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
