import { Button } from '@headlessui/react';
import { FilterProps } from '@/interfaces';

export default function filter({ typeFilter, setTypeFilter, taskTypes, statusFilter, setStatusFilter, handleFilterChange }: FilterProps) {
    return (
        <div className="mb-6 rounded-md border p-4 dark:border-gray-700">
            <h3 className="mb-4 text-lg font-medium">Filters</h3>
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-grow">
                    <label htmlFor="type_filter" className="block text-sm font-medium dark:text-gray-300">
                        Type
                    </label>
                    <select
                        id="type_filter"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="mt-1 block w-full rounded-md border p-2 sm:text-sm dark:border-gray-600 dark:bg-gray-700"
                    >
                        <option value="">All Types</option>
                        {taskTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex-grow">
                    <label htmlFor="status_filter" className="block text-sm font-medium dark:text-gray-300">
                        Status
                    </label>
                    <select
                        id="status_filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="mt-1 block w-full rounded-md border p-2 sm:text-sm dark:border-gray-600 dark:bg-gray-700"
                    >
                        <option value="">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
                <Button
                    onClick={handleFilterChange}
                    className="w-auto rounded bg-blue-500 px-4 py-2 text-white hover:bg-indigo-600 h-12 mt-4 hover:cursor-pointer"
                >
                    Apply Filters
                </Button>
            </div>
        </div>
    )

}
