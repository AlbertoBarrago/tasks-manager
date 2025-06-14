import Filter from '@/components/filter';
import TaskDialog from '@/components/task-dialog';
import TaskGrid from '@/components/task-grid';
import { IndexProps, Task, TaskStats } from '@/interfaces';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@headlessui/react';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
export default function Index({ tasks, filters, taskTypes, success }: IndexProps) {
    const [typeFilter, setTypeFilter] = useState(filters.type_filter || '');
    const [statusFilter, setStatusFilter] = useState(filters.status_filter || '');
    const [taskStats, setTaskStats] = useState<TaskStats | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [funnyQuote, setFunnyQuote] = useState('');
    const [isHungry, setIsHungry] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

    const openCreateModal = () => {
        setTaskToEdit(null);
        setIsModalOpen(true);
    };

    const openEditModal = (task: Task) => {
        setTaskToEdit(task);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleFormSuccess = () => {
        console.log('Success');
    };

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
            'Dream bigger. Do bigger. Conquer.',
            "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
            "Hustle until your haters ask if you're hiring.",
            'Be a voice, not an echo.',
            'Strive for progress, not perfection.',
            'Turn your wounds into wisdom.',
            'The future belongs to those who believe in the beauty of their dreams.',
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
                // onSuccess do something
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
                            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                <h2 className="text-2xl font-semibold">Your Tasks</h2>
                                <Button
                                    onClick={openCreateModal}
                                    className="rounded bg-blue-500 px-4 py-2 text-white hover:cursor-pointer hover:bg-blue-600"
                                >
                                    Add Task
                                </Button>
                            </div>
                            <Filter
                                typeFilter={typeFilter}
                                setTypeFilter={setTypeFilter}
                                taskTypes={taskTypes}
                                statusFilter={statusFilter}
                                setStatusFilter={setStatusFilter}
                                handleFilterChange={handleFilterChange}
                            />
                            <TaskGrid tasks={tasks} openEditModal={openEditModal} handleDelete={handleDelete} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                                    <p className="text-gray-800 italic dark:text-gray-200">"{funnyQuote}"</p>
                                </div>
                            )}
                            {isHungry ? (
                                <div className="dark:bg-opacity-50 rounded-md bg-orange-100 p-3 dark:bg-orange-900">
                                    <p className="font-semibold text-orange-700 dark:text-orange-300">
                                        🚨 Alert: The Task Manager is feeling hungry! 🚨
                                    </p>
                                    <p className="text-sm text-orange-600 dark:text-orange-400">
                                        Consider grabbing a snack. Productive work needs fuel!
                                    </p>
                                </div>
                            ) : (
                                funnyQuote && (
                                    <div className="dark:bg-opacity-50 rounded-md bg-teal-100 p-3 dark:bg-teal-900">
                                        <p className="font-semibold text-teal-700 dark:text-teal-300">💡 Pro Tip:</p>
                                        <p className="text-sm text-teal-600 dark:text-teal-400">
                                            A clean desk often leads to a clean mind. Or at least, it looks good for video calls.
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <TaskDialog isOpen={isModalOpen} onClose={closeModal} taskToEdit={taskToEdit} onSuccess={handleFormSuccess} />
        </AppLayout>
    );
}
