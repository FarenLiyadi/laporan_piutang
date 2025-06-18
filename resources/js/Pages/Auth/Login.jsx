import { useEffect, useState } from "react";
import Checkbox from "@/Components/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        password: "",
        remember: false,
    });

    const [showPasswordFields, setShowPasswordFields] = useState({
        password: false,
    });

    const togglePasswordVisibility = (field) => {
        setShowPasswordFields((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    useEffect(() => {
        return () => {
            reset("password");
            localStorage.removeItem("leaderList");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        localStorage.removeItem("leaderList");
        post(route("login"));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div className="">
                    <InputLabel
                        className="text-white"
                        htmlFor="username"
                        value="username"
                    />

                    <TextInput
                        id="username"
                        type="text"
                        name="username"
                        value={data.username}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("username", e.target.value)}
                    />

                    <InputError message={errors.username} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        className="text-white"
                        htmlFor="password"
                        value="Password"
                    />

                    <div className="relative">
                        <TextInput
                            id="password"
                            type={
                                showPasswordFields.password
                                    ? "text"
                                    : "password"
                            }
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="current-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                        />

                        <button
                            type="button"
                            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                            onClick={() => togglePasswordVisibility("password")}
                        >
                            <i
                                className={`fa-solid ${
                                    showPasswordFields.password
                                        ? "fa-eye-slash"
                                        : "fa-eye"
                                }`}
                            ></i>
                        </button>
                    </div>

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="block mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-white">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="flex items-center justify-end mt-4">
                    {/*canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                        >
                            Forgot your password?
                        </Link>
                    )*/}

                    <PrimaryButton
                        className="ms-4 text-white bg-yellow-600"
                        disabled={processing}
                    >
                        Log in
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
