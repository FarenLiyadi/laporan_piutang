import { Head, Link } from "@inertiajs/react";
import NewAuthenticated from "@/Layouts/NewAuthenticated";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function accessNotAllowrd({ auth }) {

    return (
        <NewAuthenticated>
            <Head title="Access Not Allowed" />
            <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
                <div className="bg-gray-900 rounded-2xl shadow-2xl p-8 sm:p-12 w-full max-w-xl border border-gray-800">
                    <div className="text-center space-y-6">
                        <h1 className="text-8xl font-extrabold text-yellow-400 drop-shadow-lg">
                            113
                        </h1>
                        <h2 className="text-3xl sm:text-5xl font-bold text-white">
                            Access Not Allowed!
                        </h2>
                        <p className="text-gray-400">
                            You do not have permission to view this page.
                        </p>
                        <a
                            href="/"
                            className="inline-block mt-6 text-sm px-6 py-3 rounded-lg font-semibold text-gray-100 bg-blue-600 hover:bg-blue-500 transition duration-200 shadow-lg"
                        >
                            Back To Dashboard
                        </a>
                    </div>
                </div>
            </div>
        </NewAuthenticated>
    );
}
