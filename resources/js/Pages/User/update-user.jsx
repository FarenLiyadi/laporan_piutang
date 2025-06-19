import NewAuthenticated from "@/Layouts/NewAuthenticated";
import { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function updateUser({ auth }) {
    const Title = "Update User";
    const [is_enabled, setis_enabled] = useState(1);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [nomor_hp, setnomor_hp] = useState("");
    const [access_id, setAccess_id] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [errors, setErrors] = useState({});
    const [AccessRightList, setAccessRightList] = useState([]);
    const [showPasswordFields, setShowPasswordFields] = useState({
        password: false,
        confirmPassword: false,
    });

    const queryParams = new URLSearchParams(window.location.search);
    const itemId = queryParams.get("id");

    async function search() {
        const response = await getDetailUser(itemId);
        renderTableUpdateUser(response);
    }

    const togglePasswordVisibility = (field) => {
        setShowPasswordFields((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    useEffect(() => {
        search();

        // Retrieve Access Right from local storage
        const localStorageAccessRight = JSON.parse(
            localStorage.getItem("AccessRight")
        );
        if (localStorageAccessRight) {
            setAccessRightList(localStorageAccessRight);
        }
    }, []);

    async function getDetailUser(itemId) {
        let parameter = {
            item_id: itemId,
        };

        try {
            const response = await axios.get("/admin/detail-user-request", {
                params: parameter,
            });
            if (response.data.code !== 0) {
                toast.error(response.data.msg, {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    draggable: true,
                    theme: "light",
                });
                throw new Error(response.data.msg);
            }
            return response.data.data;
        } catch (error) {
            alert(error);
            console.error("There was a problem with the Axios request:", error);
            throw error;
        }
    }

    function renderTableUpdateUser(items) {
        const data = items.item;
        setnomor_hp(data[12]);
        setUsername(data[1]);
        setEmail(data[10]);
        setAccess_id(data[2] ?? "");

        setis_enabled(data[11]);
    }

    async function submitHandler(e) {
        e.preventDefault();

        let errors = {};

        if (!username.trim()) {
            errors.username = "Nama harus diisi.";
        }

        if (!email || !email.trim()) {
            errors.email = "Email harus diisi.";
        }

        if (!nomor_hp || !nomor_hp.trim()) {
            errors.nomor_hp = "Nomor Hp harus diisi.";
        }

        if (!access_id) {
            errors.access_id = "Harus Mememilih Hak Akses.";
        }

        if (password) {
            if (password.length < 8) {
                errors.password = "Password minimal 8 karakter.";
            }

            if (password != password2) {
                errors.password2 =
                    "Password dan Konfirmasi Password tidak sesuai.";
            }

            if (password2.length < 8) {
                errors.password2 = "Password minimal 8 karakter.";
            }
        }

        const queryParams = new URLSearchParams(window.location.search);
        const itemId = queryParams.get("id");

        if (Object.keys(errors).length === 0) {
            const data = {
                actor_id: auth.user.id,
                item_id: itemId,
                username: username,
                access_id: access_id,
                password: password,
                conf_password: password2,
                email: email,
                is_enabled: is_enabled,
                nomor_hp: nomor_hp,
            };

            try {
                const response = await axios.post("/admin/update-user", data);
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

                window.location.href = "/admin/list-user";
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
                                        href="/admin/list-undangan"
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
                                    <a
                                        href={`/admin/list-user`}
                                        className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white"
                                    >
                                        Daftar User
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
                    <div className="p-4 sm:p-8 bg-[#212121] dark:bg-gray-800 shadow sm:rounded-lg">
                        <div>
                            <form onSubmit={submitHandler}>
                                <h2 className="text-3xl text-white font-extrabold">
                                    {Title}
                                </h2>
                                <div className="my-2 w-full max-w-2xl mx-auto grid grid-cols-1 gap-4">
                                    <div className="w-full">
                                        <label
                                            htmlFor="nama"
                                            className="block mb-2 font-medium text-white dark:text-white"
                                        >
                                            Nama
                                        </label>
                                        <input
                                            type="text"
                                            id="nama"
                                            placeholder="Nama"
                                            className="src_change w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#e49f28] focus:border-[#e49f28] block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#e49f28] dark:focus:border-[#e49f28]"
                                            value={username}
                                            onChange={(event) => {
                                                setUsername(event.target.value);
                                            }}
                                            required
                                        />
                                        {errors.username && (
                                            <div className="text-red-600 dark:text-red-400">
                                                {errors.username}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="access_id"
                                            className="block mb-2 font-medium text-white dark:text-white"
                                        >
                                            Hak Akses
                                        </label>
                                        <select
                                            id="access_id"
                                            className="src_change w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#e49f28] focus:border-[#e49f28] block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#e49f28] dark:focus:border-[#e49f28]"
                                            value={access_id}
                                            onChange={(event) => {
                                                setAccess_id(
                                                    event.target.value
                                                );
                                            }}
                                        >
                                            <option value="">
                                                Pilih Hak Akses
                                            </option>
                                            {AccessRightList.map((data) => (
                                                <option
                                                    key={data[0]}
                                                    value={data[0]}
                                                >
                                                    {data[1]}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.access_id && (
                                            <div className="text-red-600 dark:text-red-400">
                                                {errors.access_id}
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-full">
                                        <label
                                            htmlFor="password"
                                            className="block mb-2 font-medium text-white dark:text-white"
                                        >
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={
                                                    showPasswordFields.password
                                                        ? "text"
                                                        : "password"
                                                }
                                                id="password"
                                                placeholder="Password"
                                                autoComplete=""
                                                className="src_change w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#e49f28] focus:border-[#e49f28] block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#e49f28] dark:focus:border-[#e49f28]"
                                                value={password}
                                                onChange={(event) => {
                                                    setPassword(
                                                        event.target.value
                                                    );
                                                }}
                                            />
                                            {errors.password && (
                                                <div className="text-red-600 dark:text-red-400">
                                                    {errors.password}
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                                                onClick={() =>
                                                    togglePasswordVisibility(
                                                        "password"
                                                    )
                                                }
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
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="password2"
                                            className="block mb-2 font-medium text-white dark:text-white"
                                        >
                                            Konfirmasi Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={
                                                    showPasswordFields.confirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                id="password2"
                                                placeholder="Konfirmasi Password"
                                                autoComplete=""
                                                className="src_change w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#e49f28] focus:border-[#e49f28] block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#e49f28] dark:focus:border-[#e49f28]"
                                                value={password2}
                                                onChange={(event) => {
                                                    setPassword2(
                                                        event.target.value
                                                    );
                                                }}
                                            />
                                            {errors.password2 && (
                                                <div className="text-red-600 dark:text-red-400">
                                                    {errors.password2}
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                                                onClick={() =>
                                                    togglePasswordVisibility(
                                                        "confirmPassword"
                                                    )
                                                }
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

                                    <div>
                                        <label
                                            htmlFor="is_enabled"
                                            className="block mb-2 font-medium text-white dark:text-white"
                                        >
                                            aktif
                                        </label>
                                        <select
                                            id="is_enabled"
                                            className="src_change w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#e49f28] focus:border-[#e49f28] block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#e49f28] dark:focus:border-[#e49f28]"
                                            value={is_enabled}
                                            onChange={(event) => {
                                                setis_enabled(
                                                    event.target.value
                                                );
                                            }}
                                        >
                                            <option value="1">Enabled</option>
                                            <option value="0">Disabled</option>
                                        </select>
                                        {errors.is_enabled && (
                                            <div className="text-red-600 dark:text-red-400">
                                                {errors.is_enabled}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block mb-2 font-medium text-white dark:text-white"
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder="Email"
                                            className="src_change w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#e49f28] focus:border-[#e49f28] block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#e49f28] dark:focus:border-[#e49f28]"
                                            value={email}
                                            onChange={(event) => {
                                                setEmail(event.target.value);
                                            }}
                                        />
                                        {errors.email && (
                                            <div className="text-red-600 dark:text-red-400">
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="nomor_hp"
                                            className="capitalize block mb-2 font-medium text-white dark:text-white"
                                        >
                                            nomor hp
                                        </label>
                                        <input
                                            type="nomor_hp"
                                            id="nomor_hp"
                                            placeholder="Nomor Hp"
                                            className="src_change w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-[#e49f28] focus:border-[#e49f28] block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#e49f28] dark:focus:border-[#e49f28]"
                                            value={nomor_hp}
                                            onChange={(event) => {
                                                setnomor_hp(event.target.value);
                                            }}
                                        />
                                        {errors.nomor_hp && (
                                            <div className="text-red-600 dark:text-red-400">
                                                {errors.nomor_hp}
                                            </div>
                                        )}
                                    </div>
                                    <div className="pt-5">
                                        <button
                                            type="submit"
                                            className=" w-full text-white dark:text-gray-400 bg-[#e49f28] dark:bg-gray-800 hover:text-gray-200 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150 py-2 rounded-lg"
                                        >
                                            Update User
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </NewAuthenticated>
    );
}
