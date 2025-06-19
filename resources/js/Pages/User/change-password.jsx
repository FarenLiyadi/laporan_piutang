import NewAuthenticated from "@/Layouts/NewAuthenticated";
import { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function changePassword({ auth }) {
    const Title = 'Change Password';
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [old_password, setold_password] = useState("");
    const [errors, setErrors] = useState({});
    const [showPasswordFields, setShowPasswordFields] = useState({
        password: false,
        confirmPassword: false,
        oldPassword: false,
    });

    const togglePasswordVisibility = (field) => {
        setShowPasswordFields((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };



    async function submitHandler(e) {
        e.preventDefault();

        let errors = {};

        if (old_password.length < 8) {
            errors.old_password = "Password minimal 8 karakter.";
        }

        if (password.length < 8) {
            errors.password = "Password minimal 8 karakter.";
        }

        if (password != password2) {
            errors.password2 = "Password dan Konfirmasi Password tidak sesuai.";
        }

        if (password2.length < 8) {
            errors.password2 = "Password minimal 8 karakter.";
        }


        if (Object.keys(errors).length === 0) {
            const data = {
                actor_id: auth.user.id,
                old_password: old_password,
                password: password,
                conf_password: password2,
            };

            try {
                const response = await axios.post("/admin/change-password-request", data);
                if (response.data.code !== 0) {
                    toast.error(response.data.msg, {
                        position: "top-right",
                        autoClose: 3000,
                        closeOnClick: true,
                        draggable: true,
                        theme: "light",
                    });
                    return;
                }
                // Untuk Nofitikasi
                localStorage.setItem(
                    "notif",
                    JSON.stringify({
                        type: "success",
                        msg: response.data.msg,
                    })
                );

                window.location.href = "/";
            } catch (error) {
                toast.error("Something Went Wrong!", {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    draggable: true,
                    theme: "light",
                });
            }
        } else {
            setErrors(errors);
        }
    }

    return (
        <NewAuthenticated>
            <Head title={Title} />

            <div className="pt-5 overflow-auto">
                <div className="flex justify-between items-baseline my-auto sm:px-6 lg:px-8 space-y-6">
                    <h2 className="text-2xl font-bold"></h2>

                    {/* BreadCrumb Navigation */}
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <a
                                        href="/"
                                        className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white"
                                    >
                                        Dashboard
                                    </a>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <svg
                                        className="rtl:rotate-180 w-3 h-3 text-white mx-1"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 6 10"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 9 4-4-4-4"
                                        />
                                    </svg>
                                    <span className="ms-1 text-sm font-medium text-white md:ms-2 dark:text-gray-400">
                                        {Title}
                                    </span>
                                </div>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="py-5">
                <div className="mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-[#212121] dark:bg-gray-800 shadow sm:rounded-lg w-full">
                        <form onSubmit={submitHandler}>
                            <h2 className="text-3xl text-white font-extrabold">{Title}</h2>
                            <div className="my-4 grid grid-flow-row auto-rows-max gap-6">
                                {/* Old Password */}
                                <div className="flex justify-center">
                                    <div className="w-full max-w-md">
                                        <label
                                            htmlFor="password"
                                            className="block mb-2 font-medium text-white dark:text-white"
                                        >
                                            Password Lama
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPasswordFields.oldPassword ? "text" : "password"}
                                                id="old_password"
                                                placeholder="Password Lama"
                                                className="src_change w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#e49f28] focus:border-[#e49f28] block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#e49f28] dark:focus:border-[#e49f28]"
                                                value={old_password}
                                                onChange={(e) => setold_password(e.target.value)}
                                            />
                                            {errors.old_password && (
                                                <div className="text-red-600 dark:text-red-400 mt-1 text-sm">
                                                    {errors.old_password}
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                                                onClick={() => togglePasswordVisibility("oldPassword")}
                                            >
                                            <i
                                                className={`fa-solid ${
                                                showPasswordFields.oldPassword ? "fa-eye-slash" : "fa-eye"
                                                }`}
                                            ></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Password */}
                                <div className="flex justify-center">
                                    <div className="w-full max-w-md">
                                        <label
                                            htmlFor="password"
                                            className="block mb-2 font-medium text-white dark:text-white"
                                        >
                                            Password Baru
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPasswordFields.password ? "text" : "password"}
                                                id="password"
                                                placeholder="Password Baru"
                                                className="src_change w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#e49f28] focus:border-[#e49f28] block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#e49f28] dark:focus:border-[#e49f28]"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                            {errors.password && (
                                                <div className="text-red-600 dark:text-red-400 mt-1 text-sm">
                                                    {errors.password}
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                                                onClick={() => togglePasswordVisibility("password")}
                                            >
                                            <i
                                                className={`fa-solid ${
                                                showPasswordFields.password ? "fa-eye-slash" : "fa-eye"
                                                }`}
                                            ></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="flex justify-center">
                                    <div className="w-full max-w-md">
                                    <label
                                        htmlFor="password2"
                                        className="block mb-2 font-medium text-white dark:text-white"
                                    >
                                        Konfirmasi Password
                                    </label>
                                    <div className="relative">
                                        <input
                                        type={showPasswordFields.confirmPassword ? "text" : "password"}
                                        id="password2"
                                        placeholder="Konfirmasi Password"
                                        className="src_change w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#e49f28] focus:border-[#e49f28] block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#e49f28] dark:focus:border-[#e49f28]"
                                        value={password2}
                                        onChange={(e) => setPassword2(e.target.value)}
                                        />
                                        {errors.password2 && (
                                        <div className="text-red-600 dark:text-red-400 mt-1 text-sm">
                                            {errors.password2}
                                        </div>
                                        )}
                                        <button
                                        type="button"
                                        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                                        onClick={() => togglePasswordVisibility("confirmPassword")}
                                        >
                                        <i
                                            className={`fa-solid ${
                                            showPasswordFields.confirmPassword
                                                ? "fa-eye-slash"
                                                : "fa-eye"
                                            }`}
                                        ></i>
                                        </button>
                                    </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center pt-4">
                                    <button
                                    type="submit"
                                    className="w-full max-w-md text-white dark:text-gray-400 bg-[#e49f28] dark:bg-gray-800 hover:text-gray-200 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150 py-2 rounded-lg"
                                    >
                                    Change Password
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </NewAuthenticated>
    );
}
