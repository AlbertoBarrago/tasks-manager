import { Button } from '@headlessui/react';
import { TaskGridProps } from '@/interfaces';

export default function TaskGrid({ tasks, openEditModal, handleDelete }: TaskGridProps) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                    {['Title', 'Type', 'Status', 'Due Date', ''].map((th, i) => (
                        <th
                            key={i}
                            className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                        >
                            {th || <span className="sr-only">Actions</span>}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {tasks.data.length ? (
                    tasks.data.map((task) => (
                        <tr key={task.id}>
                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap dark:text-white">{task.title}</td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">
                                {task.type || '-'}
                            </td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                                                                task.status === 'open'
                                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                                                                    : task.status === 'in_progress'
                                                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                                                                        : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                                            }`}
                                                        >
                                                            {task.status.replace('_', ' ')}
                                                        </span>
                            </td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">
                                {task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}
                            </td>
                            <td className="px-6 py-4 text-right text-sm whitespace-nowrap">
                                <Button
                                    onClick={() => openEditModal(task)}
                                    className="mr-3 text-indigo-600 hover:cursor-pointer hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200"
                                >
                                    Edit
                                </Button>
                                <Button
                                    onClick={() => handleDelete(task.id)}
                                    className="text-red-600 transition-all duration-300 ease-in-out hover:scale-110 hover:cursor-pointer hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                                >
                                    🗑️
                                </Button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            No tasks found.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    )
}
