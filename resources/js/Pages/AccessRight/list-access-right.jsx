import { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import axios from "axios";
import Pagination from "@/Components/Pagination";
import NewAuthenticated from "@/Layouts/NewAuthenticated";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dropdown from "@/Components/Dropdown";
import { RotatingLines } from "react-loader-spinner";
import { confirmDeleteWithInput } from "@/utils/confirmDeleteWithInput";

export default function listAccessRight({ auth }) {
    const [page, setPage] = useState(1);
    const [length, setLength] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const [accessName, setAccessName] = useState("");
    const [loading, setLoading] = useState(false);
    const [dataListAccessRight, setDataListAccessRight] = useState({
        item: [],
        total: 0,
    });
    const [counter, setCounter] = useState(1);

    async function search() {
        const response = await getListAccessRight(page, length, accessName);
        if (response) {
            setLoading(false);
        }
        setCounter((page - 1) * length + 1);
        setTotalPages(Math.ceil(response.total / length));
        setDataListAccessRight(response);
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

        // Remove localStorage so it will be refreshed
        localStorage.removeItem("AccessRight");
        fetchData();
    }, [accessName, length, page]);

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

    async function deleteHakAkses(e, id) {
        e.preventDefault();

        const confirmed = await confirmDeleteWithInput();
        if (!confirmed) return;

        const data = {
            actor_id: auth.user.id,
            item_id: id,
        };

        try {
            const response = await axios.post(
                "/admin/delete-access-right",
                data
            );
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
            toast.success(response.data.msg, {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                draggable: true,
                theme: "light",
            });
            // Reload Data
            search();
        } catch (error) {
            toast.error("Something Went Wrong", {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
                draggable: true,
                theme: "light",
            });
        }
    }

    async function getListAccessRight(page = 1, length = 10, accessName) {
        let parameter = {
            page: page,
            length: length,
            access_name: accessName,
        };

        try {
            const response = await axios.get(
                "/admin/list-access-right-request",
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
            toast.error("Something Went Wrong!", {
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

    function pageAddAccessRight() {
        window.location.href = "/admin/create-access-right";
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
        setAccessName("");
        setPage(1);
    }

    return (
        <NewAuthenticated>
            <Head title="Daftar Hak Akses" />
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
                <div className="items-baseline  flex justify-between my-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="">
                        <button
                            type="button"
                            className="text-white  dark:text-gray-400 bg-[#e49f28] dark:bg-gray-800 hover:text-gray-200 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150 font-bold py-2 px-4 rounded-lg"
                            onClick={pageAddAccessRight}
                        >
                            +
                        </button>
                    </div>

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
                                        Daftar Hak Akses
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
                            <div className="flex justify-between items-center">
                                <label className="text-2xl text-white"></label>
                                <button
                                    onClick={resetPencarian}
                                    className="hint-text text-white dark:text-gray-400 bg-[#e49f28] dark:bg-gray-800 hover:text-gray-200 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150 font-bold py-2 px-4 rounded-lg"
                                >
                                    Reset
                                </button>
                            </div>
                            <div className="my-2 grid grid-flow-col auto-cols-max gap-2">
                                <div className="">
                                    <label
                                        htmlFor="nama"
                                        className="block mb-2 font-medium text-white dark:text-white"
                                    >
                                        Nama Hak Akses
                                    </label>
                                    <input
                                        type="text"
                                        id="nama"
                                        placeholder="Nama Hak Akses"
                                        className="src_change bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#e49f28] focus:border-[#e49f28] block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-[#e49f28] dark:focus:border-[#e49f28]"
                                        onChange={(accessName) => {
                                            setAccessName(
                                                accessName.target.value
                                            );
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
                            Daftar Hak Akses
                        </h2>
                        <div className="pt-4 table-auto text-white w-full">
                            <table className="border-collapse w-full border border-slate-500">
                                <thead>
                                    <tr>
                                        <th className="border border-slate-600 text-xl p-2">
                                            #
                                        </th>
                                        <th className="text-start border border-slate-600 text-xl p-2">
                                            Nama Hak Akses
                                        </th>

                                        <th className="text-end border border-slate-600 text-xl p-2">
                                            Tanggal dibuat
                                        </th>
                                        <th className="border border-slate-600 text-xl p-2">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody id="table-body">
                                    {dataListAccessRight.total === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="text-center font-bold text-2xl p-2"
                                            >
                                                No Data Found
                                            </td>
                                        </tr>
                                    ) : (
                                        dataListAccessRight.item.map(
                                            (data, index) => (
                                                <tr key={index}>
                                                    <td className="text-center border border-slate-600 py-2">
                                                        {counter + index}
                                                    </td>
                                                    <td className="text-start border border-slate-700 px-3">
                                                        {data[1]}
                                                    </td>

                                                    <td className="text-end border border-slate-700 px-3">
                                                        {new Date(
                                                            data[2]
                                                        ).toLocaleDateString(
                                                            "id-ID",
                                                            {
                                                                weekday: "long",
                                                                day: "2-digit",
                                                                month: "long",
                                                                year: "numeric",
                                                            }
                                                        )}
                                                    </td>
                                                    <td className="text-center border border-slate-700 py-1">
                                                        <Dropdown className="absolute">
                                                            <Dropdown.Trigger>
                                                                <span className="inline-flex rounded-md">
                                                                    <button
                                                                        type="button"
                                                                        className="inline-flex items-center text-xs md:text-sm px-1 py-1 md:px-3 md:py-2 border border-transparent leading-4 font-medium rounded-md text-white dark:text-gray-400 bg-[#e49f28] dark:bg-[#e49f28] hover:text-gray-200 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                                                                    >
                                                                        Aksi
                                                                        <svg
                                                                            className="ms-2 -me-0.5 h-4 w-4"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 20 20"
                                                                            fill="currentColor"
                                                                        >
                                                                            <path
                                                                                fillRule="evenodd"
                                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                                clipRule="evenodd"
                                                                            />
                                                                        </svg>
                                                                    </button>
                                                                </span>
                                                            </Dropdown.Trigger>

                                                            <Dropdown.Content>
                                                                <div className="relative z-50">
                                                                    <a
                                                                        className={
                                                                            "block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 transition duration-150 ease-in-out "
                                                                        }
                                                                        href={`/admin/detail-access-right?id=${data[0]}`}
                                                                    >
                                                                        detail
                                                                    </a>
                                                                    <a
                                                                        className={
                                                                            "block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 transition duration-150 ease-in-out "
                                                                        }
                                                                        href={`/admin/update-access-right?id=${data[0]}`}
                                                                    >
                                                                        edit
                                                                    </a>
                                                                    <p
                                                                        className={
                                                                            "block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 transition duration-150 ease-in-out "
                                                                        }
                                                                        onClick={(
                                                                            event
                                                                        ) =>
                                                                            deleteHakAkses(
                                                                                event,
                                                                                data[0]
                                                                            )
                                                                        }
                                                                    >
                                                                        hapus
                                                                    </p>
                                                                </div>
                                                            </Dropdown.Content>
                                                        </Dropdown>
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
