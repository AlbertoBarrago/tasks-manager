<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;


class TaskController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): InertiaResponse
    {
        $query = Task::where('user_id', Auth::id());

        if ($request->has('type_filter') && $request->type_filter) {
            $query->where('type', $request->type_filter);
        }
        if ($request->has('status_filter') && $request->status_filter) {
            $query->where('status', $request->status_filter);
        }

        $tasks = $query->orderBy('created_at', 'desc')->paginate(10);
        $taskTypes = Task::query()->distinct()->pluck('type')->filter()->values();


        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'filters' => $request->only(['type_filter', 'status_filter']),
            'taskTypes' => $taskTypes,
        ]);
    }

    public function create(): InertiaResponse
    {
        return Inertia::render('tasks/create');
    }

    public function store(StoreTaskRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        Auth::user()->tasks()->create($validated);
        return redirect()->route('tasks.index')->with('success', 'Task created successfully.');
    }

    public function edit(Task $task): InertiaResponse
    {
        $this->authorize('update', $task);
        return Inertia::render('tasks/edit', [
            'task' => $task,
        ]);
    }

    public function update(UpdateTaskRequest $request, Task $task): RedirectResponse
    {
        $this->authorize('update', $task);
        $validated = $request->validated();
        $task->update($validated);
        return redirect()->route('tasks.index')->with('success', 'Task updated successfully.');
    }

    public function destroy(Task $task): RedirectResponse
    {
        $this->authorize('delete', $task);
        $task->delete();
        return redirect()->route('tasks.index')->with('success', 'Task deleted successfully.');
    }

    public function stats(): JsonResponse
    {
        $stats = Task::where('user_id', Auth::id())
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        $allStatuses = ['open', 'in_progress', 'closed'];
        $formattedStats = [];
        foreach ($allStatuses as $status) {
            $formattedStats[$status] = $stats[$status] ?? 0;
        }

        return response()->json($formattedStats);
    }
}
