import React from 'react';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Textarea } from '@headlessui/react';

interface TaskFormData {
    title: string;
    description: string;
    type: string;
    status: 'open' | 'in_progress' | 'closed';
    due_date: string;
}

interface TaskFormFieldsProps {
    data: TaskFormData; // Changed 'any' to 'TaskFormData' for better type safety
    setData: (field: keyof TaskFormData, value: string | TaskFormData['status']) => void; // More specific value type
    errors: Partial<Record<keyof TaskFormData, string>>;
}

export default function TaskFormFields({ data, setData, errors }: TaskFormFieldsProps) {
    return (
        <div className="space-y-6">
            <div>
                <Label htmlFor="title">Title</Label>
                <Input // Changed from Textarea for a single-line input
                    id="title"
                    name="title"
                    type="text"
                    value={data.title}
                    className="mt-1 block w-full"
                    autoComplete="title"
                    onChange={(e) => setData('title', e.target.value)}
                    required // Keep if title is always required
                />
                <InputError message={errors.title} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                    id="description"
                    name="description"
                    value={data.description}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('description', e.target.value)}
                    rows={4}
                    placeholder="Enter task description..."
                />
                <InputError message={errors.description} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="type">Type (e.g., work, personal)</Label>
                <Input // Changed from Textarea
                    id="type"
                    name="type"
                    type="text"
                    value={data.type}
                    className="mt-1 block w-full"
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
                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm"
                >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                </select>
                <InputError message={errors.status} className="mt-2" />
            </div>

            <div>
                <Label htmlFor="due_date">Due Date (Optional)</Label>
                <Input
                    id="due_date"
                    name="due_date"
                    type="date"
                    value={data.due_date}
                    className="mt-1 block w-full"
                    onChange={(e) => setData('due_date', e.target.value)}
                />
                <InputError message={errors.due_date} className="mt-2" />
            </div>
        </div>
    );
}
