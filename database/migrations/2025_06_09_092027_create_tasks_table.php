<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // If tasks are user-specific
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('type')->nullable(); // e.g., 'work', 'personal', 'urgent'
            $table->enum('status', ['open', 'in_progress', 'closed'])->default('open');
            $table->timestamp('due_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
