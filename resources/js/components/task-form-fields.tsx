import React from 'react';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Textarea } from '@headlessui/react';
import { TaskFormData } from '@/interfaces';

interface TaskFormFieldsProps {
    data: TaskFormData;
    setData: (field: keyof TaskFormData, value: string | TaskFormData['status']) => void;
    errors: Partial<Record<keyof TaskFormData, string>>;
}

export default function TaskFormFields({ data, setData, errors }: TaskFormFieldsProps) {
    // Base classes for input-like elements for consistency
    const inputBaseClasses =
        'mt-1 block w-full rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-1';
    const lightModeClasses =
        'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-indigo-500';
    const darkModeClasses =
        'dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400';

    return (
        <div className="space-y-6">
            <div>
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder={"Enter task title..."}
                    value={data.title}
                    className="mt-1 block w-full bg-gray-700 text-gray-300'"
                    autoComplete="title"
                    onChange={(e) => setData('title', e.target.value)}
                    required
                />
                <InputError message={errors.title} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                    id="description"
                    name="description"
                    value={data.description}
                    className={`${inputBaseClasses} ${lightModeClasses} ${darkModeClasses} px-3 py-2`}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={4}
                    placeholder="Enter task description..."
                />
                <InputError message={errors.description} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="type">Type (e.g., work, personal)</Label>
                <Input // Assuming this shadcn/ui component already has good contrast and styling
                    id="type"
                    name="type"
                    type="text"
                    value={data.type}
                    className="mt-1 block w-full" // Relies on shadcn/ui default styling
                    onChange={(e) => setData('type', e.target.value)}
                    placeholder="e.g., Work, Personal, Urgent"
                />
                <InputError message={errors.type} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="status">Status</Label>
                <select
                    id="status"
                    name="status"
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value as TaskFormData['status'])}
                    className={`${inputBaseClasses} ${lightModeClasses} ${darkModeClasses} px-3 py-2`}
                >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                </select>
                <InputError message={errors.status} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="due_date">Due Date (Optional)</Label>
                <Input // Assuming this shadcn/ui component already has good contrast and styling
                    id="due_date"
                    name="due_date"
                    type="date"
                    value={data.due_date}
                    className="mt-1 block w-full" // Relies on shadcn/ui default styling
                    onChange={(e) => setData('due_date', e.target.value)}
                />
                <InputError message={errors.due_date} className="mt-2" />
            </div>
        </div>
    );
}
