export interface Task {
    id: number;
    title: string;
    description: string | null;
    type: string | null;
    status: 'open' | 'in_progress' | 'closed';
    due_date: string | null;
}

export interface TaskFormData {
    title: string;
    description: string;
    type: string;
    status: 'open' | 'in_progress' | 'closed';
    due_date: string;

    [key: string]: string | 'open' | 'in_progress' | 'closed' | undefined;
}

export interface PaginatedTasks {
    data: Task[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

export interface IndexProps {
    tasks: PaginatedTasks;
    filters: { type_filter?: string; status_filter?: string };
    taskTypes: string[];
    success?: string;
}

export interface TaskStats {
    open: number;
    in_progress: number;
    closed: number;

    [key: string]: number;
}
