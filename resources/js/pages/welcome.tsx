import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col justify-center bg-[#FDFDFC] px-6 text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                <main className="flex flex-col-reverse items-center justify-center gap-12 text-center">
                    <div className="max-w-lg space-y-6">
                        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Organize your work. Stay productive.</h1>
                        <p className="text-base text-gray-600 dark:text-gray-400">
                            TaskFlow is a clean, simple task manager that keeps you focused. Log in and take control of your day — one task at a time.
                        </p>
                        {!auth.user && (
                            <div className="flex justify-center gap-4">
                                <Link
                                    href={route('register')}
                                    className="rounded-md bg-[#1b1b18] px-6 py-2 text-white shadow hover:bg-[#333] dark:bg-white dark:text-black dark:hover:bg-[#e5e5e5]"
                                >
                                    Get Started
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="rounded-md border border-[#1b1b18]/30 px-6 py-2 hover:bg-[#1b1b18]/5 dark:border-[#EDEDEC]/30 dark:hover:bg-[#EDEDEC]/10"
                                >
                                    Log in
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="w-full max-w-sm lg:max-w-md">
                        <img src="https://media.istockphoto.com/id/1492645918/photo/survey-form-concept-businessman-using-laptops-do-online-checklist-surveys-questionnaire-with.jpg?s=612x612&w=0&k=20&c=lqbzWDBLxqRe99kOz2GwfWDRzkVduf2BvUzn1NBGh7Q=" alt="Task Manager Illustration" className="w-full" />
                    </div>
                </main>

                <footer className="mt-16 text-center text-sm text-gray-400 dark:text-gray-600">© 2025 TaskFlow. All rights reserved.</footer>
            </div>
        </>
    );
}
