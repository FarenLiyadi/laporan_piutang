import NewAuthenticated from "@/Layouts/NewAuthenticated";
import { useEffect } from "react";
import { Head } from "@inertiajs/react";
import { toast } from "react-toastify";
import axios from "axios";

export default function detailUser({ auth }) {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const queryParams = new URLSearchParams(window.location.search);
                const itemId = queryParams.get("id");

                const response = await getDetailUser(itemId);
                renderTableDetailUser(response);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
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
            toast.error(error, {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                draggable: true,
                theme: "light",
            });
            console.error("There was a problem with the Axios request:", error);
            throw error;
        }
    }

    function renderTableDetailUser(items) {
        const data = items.item;
        // console.log(data);

        let userId = document.getElementById("user_id");
        let nama = document.getElementById("nama");
        let email = document.getElementById("email");
        let nomor_hp = document.getElementById("nomor_hp");
        let access_id = document.getElementById("access_id");

        let dibuatOleh = document.getElementById("dibuat_oleh");
        let tanggal = document.getElementById("tanggal");

        let tanggal_diupdate = document.getElementById("updated_at");
        let update_terakhir = document.getElementById("updated_by");

        const accessRight = JSON.parse(localStorage.getItem("AccessRight"));
        const accessName = accessRight.find((item) => item[0] === data[2]);

        userId.textContent = data[0];
        nama.textContent = data[1];
        email.textContent = data[10] ?? "-";
        nomor_hp.textContent = data[12] ?? "-";
        access_id.textContent = accessName[1] ?? "-";

        dibuatOleh.textContent = data[8];

        update_terakhir.textContent = data[7];
        tanggal.textContent = new Date(data[5]).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
        tanggal_diupdate.textContent = new Date(data[6]).toLocaleDateString(
            "id-ID",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    }

    function pageUpdateUser() {
        const queryParams = new URLSearchParams(window.location.search);
        const itemId = queryParams.get("id");
        window.location.href = `/admin/update-user?id=${itemId}`;
    }

    return (
        <NewAuthenticated>
            <Head title="Detail User" />

            <div className="pt-5 overflow-auto">
                <div className="flex justify-between items-baseline my-auto sm:px-6 lg:px-8 space-y-6">
                    <h2 className="text-2xl font-bold text-white"></h2>

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
                                    <a
                                        href={`/admin/list-user`}
                                        className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white"
                                    >
                                        List User
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
                                        Detail User
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
                        <div className="flex justify-between">
                            <h2 className="text-3xl text-white font-extrabold">
                                Detail User
                            </h2>
                            <div>
                                <button
                                    onClick={pageUpdateUser}
                                    className="rounded px-2 py-1.5 font-semibold w-full text-white dark:text-gray-400 bg-[#e49f28] hover:text-gray-200 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150 "
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                        <div className="pt-4 table-auto w-full">
                            <table className="w-full border-collapse border border-slate-500">
                                <tbody id="table-body">
                                    <tr>
                                        <td className="text-white border border-slate-600 font-bold text-xl p-2">
                                            User ID
                                        </td>
                                        <td
                                            className="text-white border border-slate-600 text-xl p-2"
                                            id="user_id"
                                        ></td>
                                    </tr>
                                    <tr>
                                        <td className="text-white border border-slate-600 font-bold text-xl p-2">
                                            Username
                                        </td>
                                        <td
                                            className="text-white border border-slate-600 text-xl p-2"
                                            id="nama"
                                        ></td>
                                    </tr>
                                    <tr>
                                        <td className="text-white border border-slate-600 font-bold text-xl p-2">
                                            Email
                                        </td>
                                        <td
                                            className="text-white border border-slate-600 text-xl p-2"
                                            id="email"
                                        ></td>
                                    </tr>
                                    <tr>
                                        <td className="text-white border border-slate-600 font-bold text-xl p-2">
                                            Nomor HP
                                        </td>
                                        <td
                                            className="text-white border border-slate-600 text-xl p-2"
                                            id="nomor_hp"
                                        ></td>
                                    </tr>

                                    <tr>
                                        <td className="text-white border border-slate-600 w-1/3 font-bold text-xl p-2">
                                            Hak Akses
                                        </td>
                                        <td
                                            className="text-white border border-slate-600 text-xl p-2"
                                            id="access_id"
                                        ></td>
                                    </tr>

                                    <tr>
                                        <td className="text-white border border-slate-600 font-bold text-xl p-2">
                                            Dibuat Oleh
                                        </td>
                                        <td
                                            className="text-white border border-slate-600 text-xl p-2"
                                            id="dibuat_oleh"
                                        ></td>
                                    </tr>
                                    <tr>
                                        <td className="text-white border border-slate-600 font-bold text-xl p-2">
                                            Dibuat Tanggal
                                        </td>
                                        <td
                                            className="text-white border border-slate-600 text-xl p-2"
                                            id="tanggal"
                                        ></td>
                                    </tr>
                                    <tr>
                                        <td className="capitalize text-white border border-slate-600 font-bold text-xl p-2">
                                            Terakhir Diupdate oleh
                                        </td>
                                        <td
                                            className="capitalize text-white border border-slate-600 text-xl p-2"
                                            id="updated_by"
                                        ></td>
                                    </tr>
                                    <tr>
                                        <td className="capitalize text-white border border-slate-600 font-bold text-xl p-2">
                                            Terakhir Diupdate Pada
                                        </td>
                                        <td
                                            className="capitalize text-white border border-slate-600 text-xl p-2"
                                            id="updated_at"
                                        ></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </NewAuthenticated>
    );
}
