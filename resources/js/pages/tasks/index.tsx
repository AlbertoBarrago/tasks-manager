import AuthLayout from '@/layouts/auth-layout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import AppLayout from '@/layouts/app-layout';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Task {
    id: number;
    title: string;
    description: string | null;
    type: string | null;
    status: 'open' | 'in_progress' | 'closed';
    due_date: string | null;
}

interface PaginatedTasks {
    data: Task[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface IndexProps {
    auth: any; // Consider defining a more specific type for auth user
    tasks: PaginatedTasks;
    filters: { type_filter?: string; status_filter?: string };
    taskTypes: string[];
    success?: string;
}

interface TaskStats {
    open: number;
    in_progress: number;
    closed: number;

    [key: string]: number;
}

export default function Index({ tasks, filters, taskTypes, success }: IndexProps) {
    const [typeFilter, setTypeFilter] = useState(filters.type_filter || '');
    const [statusFilter, setStatusFilter] = useState(filters.status_filter || '');
    const [taskStats, setTaskStats] = useState<TaskStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [funnyQuote, setFunnyQuote] = useState('');
    const [isHungry, setIsHungry] = useState(false);

    useEffect(() => {
        axios
            .get(route('dashboard.taskStats'))
            .then((response) => {
                setTaskStats(response.data);
            })
            .catch((error) => {
                console.error('Error fetching task stats:', error);
            })
            .finally(() => {
                setLoadingStats(false);
            });

        const quotes = [
            "I'm not lazy, I'm on energy-saving mode.",
            'Why did the scarecrow win an award? Because he was outstanding in his field!',
            'My bed is a magical place where I suddenly remember everything I forgot to do.',
            'I told my wife she was drawing her eyebrows too high. She seemed surprised.',
        ];
        setFunnyQuote(quotes[Math.floor(Math.random() * quotes.length)]);
        setIsHungry(Math.random() < 0.3);
    }, []);

    const chartData = {
        labels: taskStats ? Object.keys(taskStats).map((s) => s.replace('_', ' ').toUpperCase()) : [],
        datasets: [
            {
                label: 'Task Status',
                data: taskStats ? Object.values(taskStats) : [],
                backgroundColor: [
                    'rgba(255, 206, 86, 0.5)', // Open
                    'rgba(54, 162, 235, 0.5)', // In Progress
                    'rgba(75, 192, 192, 0.5)', // Closed
                ],
                borderColor: ['rgba(255, 206, 86, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Task Status Overview',
            },
        },
    };

    const handleFilterChange = () => {
        router.get(
            route('tasks.index'),
            {
                type_filter: typeFilter,
                status_filter: statusFilter,
            },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = (taskId: number) => {
        if (confirm('Are you sure you want to delete this task?')) {
            router.delete(route('tasks.destroy', taskId), {
                // onSuccess callback can be used for feedback
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Tasks" />
            <div className="min-w-full py-5">
                <div className="mx-auto max-w-screen-2xl space-y-8 sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {success && <div className="mb-4 rounded bg-green-100 p-4 text-green-700">{success}</div>}
                            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <h2 className="text-2xl font-semibold">Your Tasks</h2>
                                <Link href={route('tasks.create')} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                                    Add Task
                                </Link>
                            </div>
                            <div className="mb-6 border rounded-md p-4 dark:border-gray-700">
                                <h3 className="mb-4 text-lg font-medium">Filters</h3>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-grow">
                                        <label htmlFor="type_filter" className="block text-sm font-medium dark:text-gray-300">Type</label>
                                        <select id="type_filter" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="mt-1 block w-full rounded-md border p-2 sm:text-sm dark:border-gray-600 dark:bg-gray-700">
                                            <option value="">All Types</option>
                                            {taskTypes.map((type) => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex-grow">
                                        <label htmlFor="status_filter" className="block text-sm font-medium dark:text-gray-300">Status</label>
                                        <select id="status_filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="mt-1 block w-full rounded-md border p-2 sm:text-sm dark:border-gray-600 dark:bg-gray-700">
                                            <option value="">All Statuses</option>
                                            <option value="open">Open</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </div>
                                    <button onClick={handleFilterChange} className="w-full sm:w-auto rounded bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600">
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        {['Title', 'Type', 'Status', 'Due Date', ''].map((th, i) => (
                                            <th key={i} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                                                {th || <span className="sr-only">Actions</span>}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                    {tasks.data.length ? tasks.data.map((task) => (
                                        <tr key={task.id}>
                                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap dark:text-white">{task.title}</td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">{task.type || '-'}</td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        task.status === 'open' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                            : task.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                                : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-300">
                                                {task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm whitespace-nowrap">
                                                <Link href={route('tasks.edit', task.id)} className="mr-3 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">
                                                    Edit
                                                </Link>
                                                <button onClick={() => handleDelete(task.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">No tasks found.</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                            {tasks.links.length > 3 && (
                                <div className="mt-4 flex flex-wrap -mb-1">
                                    {tasks.links.map((link, key) => (
                                        link.url === null ? (
                                            <div key={key} className="mr-1 mb-1 rounded border px-4 py-3 text-sm text-gray-400 dark:border-gray-600" dangerouslySetInnerHTML={{ __html: link.label }} />
                                        ) : (
                                            <Link key={key} href={link.url} className={`mr-1 mb-1 rounded border px-4 py-3 text-sm hover:bg-gray-50 focus:border-indigo-500 focus:text-indigo-500 dark:border-gray-600 dark:hover:bg-gray-700 ${link.active ? 'bg-white dark:bg-gray-700' : 'dark:text-gray-300'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 shadow-sm sm:rounded-lg dark:bg-gray-800">
                            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">Task Statistics</h3>
                            {loadingStats ? (
                                <p className="text-gray-500 dark:text-gray-400">Loading stats...</p>
                            ) : taskStats ? (
                                <Bar options={chartOptions} data={chartData} />
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">Could not load task statistics.</p>
                            )}
                        </div>
                        <div className="space-y-4 bg-white p-6 shadow-sm sm:rounded-lg dark:bg-gray-800">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">A Little Something Extra...</h3>
                            {funnyQuote && (
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Humor for the day:</p>
                                    <p className="italic text-gray-800 dark:text-gray-200">"{funnyQuote}"</p>
                                </div>
                            )}
                            {isHungry ? (
                                <div className="rounded-md bg-orange-100 p-3 dark:bg-orange-900 dark:bg-opacity-50">
                                    <p className="font-semibold text-orange-700 dark:text-orange-300">🚨 Alert: The Task Manager is feeling hungry! 🚨</p>
                                    <p className="text-sm text-orange-600 dark:text-orange-400">Consider grabbing a snack. Productive work needs fuel!</p>
                                </div>
                            ) : funnyQuote && (
                                <div className="rounded-md bg-teal-100 p-3 dark:bg-teal-900 dark:bg-opacity-50">
                                    <p className="font-semibold text-teal-700 dark:text-teal-300">💡 Pro Tip:</p>
                                    <p className="text-sm text-teal-600 dark:text-teal-400">A clean desk often leads to a clean mind. Or at least, it looks good for video calls.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>


        </AppLayout>
    );
}
