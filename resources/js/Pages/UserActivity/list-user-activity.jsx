import { useState, useEffect, useRef } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";
import Pagination from "@/Components/Pagination";
import NewAuthenticated from "@/Layouts/NewAuthenticated";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { RotatingLines } from "react-loader-spinner";

export default function listUserActivity({ auth }) {
    const [page, setPage] = useState(1);
    const [length, setLength] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const [username, setUsername] = useState("");
    const [dataListUserActivity, setDataListUserActivity] = useState({
        item: [],
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [counter, setCounter] = useState(1);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const flatpickrRef = useRef(null);

    async function search() {
        const response = await getListUserActivity(
            page,
            length,
            username,
            startDate,
            endDate
        );
        if (response) {
            setLoading(false);
        }

        setCounter((page - 1) * length + 1);
        setTotalPages(Math.ceil(response.total / length));
        setDataListUserActivity(response);
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                search();
            } catch (error) {
                toast.error(error, {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    draggable: true,
                    theme: "light",
                });
                console.error(error);
            }
        };

        fetchData();
    }, [username, length, page, startDate, endDate]);

    function handleChangeLength() {
        let selectedLength = document.getElementById("src_length").value;
        setPage(1);
        setLength(parseInt(selectedLength));
    }

    function prevBtn() {
        if (page > 1) {
            setPage(page - 1);
        }
    }

    function nextBtn() {
        if (page < totalPages) {
            setPage(page + 1);
        }
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            let tmp = e.target.value.trim();

            if (isNaN(tmp) || tmp === "" || tmp.includes(" ")) {
                toast.error("Please enter a valid number", {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    draggable: true,
                    theme: "light",
                });
                return;
            }

            tmp = Number(tmp);

            if (tmp <= 0 || tmp > totalPages) {
                toast.error("Invalid Input", {
                    position: "top-right",
                    autoClose: 3000,
                    closeOnClick: true,
                    draggable: true,
                    theme: "light",
                });
                return;
            }

            setPage(tmp);
        }
    }

    async function getListUserActivity(
        page = 1,
        length = 10,
        username,
        startDate,
        endDate
    ) {
        let parameter = {
            page: page,
            length: length,
            username: username,
            start_date: startDate, // Correctly call toLocaleDateString
            end_date: endDate, // Correctly call toLocaleDateString
        };

        try {
            const response = await axios.get(
                "/admin/list-user-activity-request",
                {
                    params: parameter,
                }
            );
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
            setLoading(false);
            throw error;
        }
    }

    function resetPencarian() {
        const inputs = document.querySelectorAll(
            ".src_keyup, .src_change, .src_date"
        );
        inputs.forEach(function (input) {
            if (input.type === "checkbox" || input.type === "radio") {
                input.checked = false;
            } else if (input.tagName === "SELECT") {
                // Handle Select2 elements
                if (input.classList.contains("js-select2")) {
                    // Use Select2's method to reset
                    $(input).val(null).trigger("change");
                } else {
                    input.selectedIndex = 0;
                }
            } else {
                input.value = "";

                if (input._flatpickr) {
                    input._flatpickr.clear();
                }
            }
        });

        setUsername("");
        setStartDate("");
        setEndDate("");
        setPage(1);
    }

    // Konversi waktu lokal
    const formatDateTimeStart = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const formatDateTimeEnd = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = "23"; // Waktu berakhir pukul 23:59:59
        const minutes = "59";
        const seconds = "59";

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    return (
        <NewAuthenticated>
            <Head title="Daftar Aktivitas User" />
            {loading && (
                <div className="fixed inset-0  z-[99] flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <RotatingLines
                            visible={true}
                            height="48"
                            width="48"
                            strokeWidth="5"
                            animationDuration="1"
                            ariaLabel="rotating-lines-loading"
                            strokeColor="white"
                        />
                        <p className="mt-4 text-xl font-semibold text-white">
                            Loading Data...
                        </p>
                    </div>
                </div>
            )}

            <div className="pt-5">
                <div className="flex justify-between my-auto sm:px-6 lg:px-8 space-y-6">
                    <div></div>

                    {/* BreadCrumb Navigation */}
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                            <li className="inline-flex items-center">
                                <a
                                    href="/"
                                    className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-white"
                                >
                                    Dashboard
                                </a>
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
                                        Aktivitas User
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
                        <div className="overflow-x-auto">
                            <div className="flex justify-between items-center">
                                <label className="text-white font-bold text-3xl">
                                    Pencarian
                                </label>
                                <button
                                    onClick={resetPencarian}
                                    className="text-white dark:text-gray-400 bg-[#e49f28] dark:bg-gray-800 hover:text-gray-200 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150 font-bold py-2 px-4 rounded-lg"
                                >
                                    Reset
                                </button>
                            </div>
                            <div className="my-2 grid grid-flow-col auto-cols-max gap-2">
                                <div className="">
                                    <label
                                        htmlFor="nama"
                                        className="block mb-2 font-medium text-gray-900 dark:text-white"
                                    >
                                        Nama
                                    </label>
                                    <input
                                        type="text"
                                        id="nama"
                                        placeholder="nama"
                                        className="src_change bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        onChange={(username) => {
                                            setUsername(username.target.value);
                                            setPage(1);
                                        }}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="Tanggal"
                                        className="block mb-2 font-medium text-gray-900 dark:text-white"
                                    >
                                        Tanggal
                                    </label>
                                    <Flatpickr
                                        ref={flatpickrRef}
                                        id="tanggal"
                                        placeholder="Pilih tanggal"
                                        className="src_change capitalize bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        options={{
                                            mode: "range",
                                            dateFormat: "Y-m-d",
                                        }}
                                        onChange={(dates) => {
                                            if (dates.length === 0) {
                                                setStartDate("");
                                                setEndDate("");
                                            } else {
                                                const [start, end] = dates;

                                                const localStart =
                                                    formatDateTimeStart(
                                                        new Date(start)
                                                    );
                                                const localEnd = end
                                                    ? formatDateTimeEnd(
                                                          new Date(end)
                                                      )
                                                    : localStart;

                                                setStartDate(localStart);
                                                setEndDate(localEnd);
                                            }
                                            setPage(1);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pb-5">
                <div className="mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-[#212121] dark:bg-gray-800 shadow sm:rounded-lg">
                        <h2 className="text-3xl text-white font-extrabold">
                            Daftar Aktivitas User
                        </h2>
                        <div className="pt-4 overflow-auto text-white w-full">
                            <table className="border-collapse w-full border border-slate-500">
                                <thead>
                                    <tr>
                                        <th className="border border-slate-600 text-xl py-2 px-3">
                                            #
                                        </th>
                                        <th className="text-start border border-slate-600 text-xl py-2 px-3">
                                            Nama
                                        </th>
                                        <th className="text-start border border-slate-600 text-xl py-2 px-3">
                                            Deskripsi
                                        </th>
                                        <th className="text-end border border-slate-600 text-xl py-2 px-3">
                                            Tanggal dibuat
                                        </th>
                                    </tr>
                                </thead>
                                <tbody id="table-body">
                                    {dataListUserActivity.total === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="text-center font-bold text-2xl p-2"
                                            >
                                                No Data Found
                                            </td>
                                        </tr>
                                    ) : (
                                        dataListUserActivity.item.map(
                                            (user, index) => (
                                                <tr key={index}>
                                                    <td className="text-center border border-slate-600 py-2">
                                                        {counter + index}
                                                    </td>
                                                    <td className="text-start border border-slate-700 px-3">
                                                        {user.username}
                                                    </td>
                                                    <td className="text-start border border-slate-700 px-3">
                                                        {user.description}
                                                    </td>
                                                    <td className="text-end border border-slate-700 px-3">
                                                        {new Date(
                                                            user.created_at
                                                        ).toLocaleDateString(
                                                            "id-ID",
                                                            {
                                                                weekday: "long",
                                                                day: "2-digit",
                                                                month: "long",
                                                                year: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            onChange={handleChangeLength}
                            prevBtn={prevBtn}
                            nextBtn={nextBtn}
                            handleKeyDown={handleKeyDown}
                            isPrevDisabled={page == 1}
                            isNextDisabled={page == totalPages}
                            page={page}
                            totalPage={totalPages}
                        />
                    </div>
                </div>
            </div>
        </NewAuthenticated>
    );
}
